import BigPromise from "../middlewares/bigPromise.js"
import { User } from "../models/user.js"
import bcrypt from "bcryptjs"
import CustomError from "../utils/customError.js"
import cookieToken from "../utils/cookieToken.js"
import cloudinary from "cloudinary"

export const signUp = BigPromise(async (req, res, next) => {
    let profilePhoto = null

    if(req.files) {
        console.log("Files found")
        let files = req.files.photos
        let res = await cloudinary.v2.uploader.upload(files.tempFilePath, {
            folder: "TestingLogin"
        })

        // console.log("Res: ", res)

        profilePhoto = {
            id: res.public_id,
            secure_url: res.secure_url
        }
    }
    else {
        console.log("Files not found")
    }

    const { firstName, lastName, email , password } = req.body

    if(!firstName || !lastName || !email || !password) {
        return next(new CustomError("Please provide all the details", 400))
    }

    const user = await User.create({
        firstName,
        lastName,
        email,
        password,
        profilePhoto
    })

    cookieToken(user, res)
    // const token = user.getJwtToken()

    // const options = {
    //     expires: new Date(
    //         Date.now() + process.env.COOKIE_EXPIRY * 24 * 60 * 60 * 1000
    //     ),
    //     httpOnly: true
    // }

    // user.password = undefined

    // res.cookie('token', token, options).redirect("/user/home")
  
})

export const login = BigPromise(async (req, res, next) => {
    const { email, password } = req.body
    
    if(!email || !password) {
        return next(new CustomError("please provide email and password", 400))
    }

    const user = await User.findOne({email: email}).select("+password")

    if(!user) {
        return next(new CustomError("user not found", 400))
    }
    console.log("user: ", user)
    const result = await user.validatePassword(password)

    if(!result) {
        return next(new CustomError("incorrect password", 400))
    }

    cookieToken(user, res)
    // const token = user.getJwtToken()

    // const options = {
    //     expires: new Date(
    //         Date.now() + process.env.COOKIE_EXPIRY * 24 * 60 * 60 * 1000
    //     ),
    //     httpOnly: true
    // }

    // user.password = undefined

    // res.cookie('token', token, options).redirect("/user/home")
})

export const follow = BigPromise(async (req, res, next) => {
    //req.params.user user to which req.user is following
    const user = await User.findById(req.params.user)
    const user2 = await User.findById(req.user.id)

    if(!user || !user2) {
        return next(new CustomError("no such user exists", 400))
    }

    user2.following.push({
        userId: user.id
    })
    
    user.followers += 1
    
    await user.save({validateBeforeSave: false})
    await user2.save({validateBeforeSave: false})

    res.status(200).json({
        success: true
    })
})

export const homeRoute = BigPromise((req, res, next) => {
    res.render("home")
})