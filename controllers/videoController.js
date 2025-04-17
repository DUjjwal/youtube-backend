import BigPromise from "../middlewares/bigPromise.js"
import CustomError from "../utils/customError.js"
import { User } from "../models/user.js"
import { Video } from "../models/video.js"
import { Comment } from "../models/comment.js"

//also update the user model for these routes
//history, 

export const upload = BigPromise(async (req, res, next) => {
    
    const { title, description } = req.body

    if(!title || !description) {
        return next(new CustomError("provide title and descrition", 400))
    }

    const user = await User.findById(req.user.id)

    if(!user) {
        return next(new CustomError("user not found", 400))
    }
    const video = await Video.create({
        title,
        description,
        owner: req.user._id
    })

    user.uploadedVideos.push({
        videoId: video.id
    })

    await user.save({validateBeforeSave: false})

    res.status(200).json({
        success: true,
        video
    })

})

export const like = BigPromise(async (req, res, next) => {
    const video = await Video.findById(req.params.video)
    const user = await User.findById(req.user.id)

    if(!video) {
        return next(new CustomError("video not found", 400))
    }

    if(!user) {
        return next(new CustomError("user not found", 400))
    }

    user.likedVideos.push({
        videoId: req.params.video
    })

    video.likes = video.likes + 1
    
    await video.save({validateBeforeSave: false})
    await user.save({validateBeforeSave: false})

    res.status(200).json({
        success: true,
        video
    })
})

export const dislike = BigPromise(async (req, res, next) => {
    const video = await Video.findById(req.params.video)

    if(!video) {
        return next(new CustomError("video not found", 400))
    }

    video.dislikes = video.dislikes + 1
    
    await video.save({validateBeforeSave: false})

    res.status(200).json({
        success: true,
        video
    })
})



export const getAllVideo = BigPromise(async (req, res, next) => {
    const video = await Video.find()

    res.status(200).json({
        success: true,
        video
    })

})

export const comment = BigPromise(async (req, res, next) => {
    const { text } = req.body

    if(!text) {
        return next(new CustomError("please provide comment text", 400))
    }

    const comment = await Comment.create({
        text,
        user: req.user.id,
        video: req.params.video
    })

    const user = await User.findById(req.user.id)

    user.myComments.push({
        commentId: comment.id
    })

    await user.save({validateBeforeSave: false}) 
    
    res.status(200).json({
        success: true
    })
})

export const getSingle = BigPromise(async (req, res, next) => {
    const video = await Video.findById(req.params.video)

    if(!video) {
        return next(new CustomError("video not found", 400))
    }
    
    res.status(200).json({
        success: true,
        video
    })
})

export const deleteVideo = BigPromise(async (req, res, next) => {
    const video = await Video.findById(req.params.video)

    if(!video) {
        return next(new CustomError("video not found", 400))
    }

    const deleteRequestUser = req.user.id
    const owner = video.owner.toString()

    console.log("Owner: ", owner)
    console.log("Delete Request User: ", deleteRequestUser)

    if(owner !== deleteRequestUser) {
        return next(new CustomError("only owner can delete a video"))
    }
    console.log("video: ", video)

    await video.deleteOne()

    res.status(200).json({
        success: true,
        message: "video deleted!"
    })
})

export const getComments = BigPromise(async (req, res, next) => {
    const comments = await Comment.find({video: req.params.video})

    res.status(200).json({
        success: true,
        comments
    })
})

export const history = BigPromise(async (req, res, next) => {

    const video = await Video.findById(req.params.video)

    if(!video) {
        return next(new CustomError("video not found", 400))
    }

    const user = req.user

    user.history.push({
        videoId: video.id
    })

    await user.save({validateBeforeSave: false})

    res.status(200).json({
        status: true,
        video
    })
})
