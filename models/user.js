import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"
import validator from "validator"
import dotenv from "dotenv/config"


const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, "Please enter firstName"],
        maxlength: [40, "Should be under 40 characters"]
    },
    lastName: {
        type: String,
        required: [true, "Please enter firstName"],
        maxlength: [40, "Should be under 40 characters"]
    },
    email: {
        type: String,
        required: [true, "Please enter email"],
        unique: true,
        validate: [validator.isEmail, "Please enter valid email"],
        trim: true
    },
    password: {
        type: String,
        required: [true, "Please enter password"]
    },
    profilePhoto: {
        id: {
            type: String
            // required: true
        },
        secure_url: {
            type: String
            // required: true
        }
    },
    history: [
        {
            videoId: {
                type: mongoose.Schema.ObjectId,
                ref: 'Video'
            }
        }
    ],
    uploadedVideos: [
        {
            videoId: {
                type: mongoose.Schema.ObjectId,
                ref: 'Video'
            }
        }
    ],
    likedVideos: [
        {
            videoId: {
                type: mongoose.Schema.ObjectId,
                ref: 'Video'
            }
        }
    ],
    following: [
        {
            userId: {
                type: mongoose.Schema.ObjectId,
                red: 'User'
            }
        }
    ]
})

userSchema.pre("save", async function(next) {
    if(!this.isModified('password'))return next();
    this.password = await bcrypt.hash(this.password, 10)
})

userSchema.methods.getJwtToken = function() {
    return jwt.sign({id: this._id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRY
    })
}

export const User = mongoose.model("User", userSchema)