import BigPromise from "../middlewares/bigPromise.js"
import CustomError from "../utils/customError.js"
import { User } from "../models/user.js"
import { Video } from "../models/video.js"

export const upload = BigPromise(async (req, res, next) => {
    
    const { title, description } = req.body

    if(!title || !description) {
        return next(new CustomError("provide title and descrition", 400))
    }

    const video = await Video.create({
        title,
        description,
        owner: req.user._id
    })

    res.status(200).json({
        success: true,
        video
    })

})

export const like = BigPromise(async (req, res, next) => {
    const video = await Video.findById(req.params.video)

    if(!video) {
        return next(new CustomError("video not found", 400))
    }

    video.likes = video.likes + 1
    
    await video.save({validateBeforeSave: false})

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

    const video = await Video.findById(req.params.video)

    if(!video) {
        return next(new CustomError("video not found", 400))
    }

    video.comments.push({
        user: req.user._id,
        text
    })

    await video.save({validateBeforeSave: false})

    res.status(200).json({
        success: true,
        video
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



