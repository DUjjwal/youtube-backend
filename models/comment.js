import mongoose, { mongo } from "mongoose";

const commentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
    },
    text: {
        type: String,
        required: [true, "Please enter comment text"]
    },
    video: {
        type: mongoose.Schema.ObjectId,
        ref: 'Video'
    }
})

export const Comment = mongoose.model('Comment', commentSchema)