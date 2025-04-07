import mongoose from "mongoose"

const videoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "please provide a title"],
        maxlength: [20, "must bt atmost 20 characters"]
    },
    description: {
        type: String,
        required: [true, "please provide a description"],
        maxlength: [100, "must bt atmost 100 characters"]
    },
    likes: {
        type: Number,
        default: 0
    },
    dislikes: {
        type: Number,
        default: 0
    },
    owner: {
        type: mongoose.Schema.ObjectId,
        ref: "User"
    },
    comments: [
        {
            user: {
                type: mongoose.Schema.ObjectId,
                ref: "User"
            },
            text: {
                type: String
            }
        }
    ],
    tags: {
        type: String,
        enum: {
            values: [
                "web-dev",
                "cp",
                "dsa",
                "ai-ml"
            ],
            message: "Please select tags"
        }
    },
    thumbnail: {
        id: {
            type: String,
        },
        secure_url: {
            type: String,
        }
    }
    
})


export const Video = mongoose.model("Video", videoSchema)