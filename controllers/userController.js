import BigPromise from "../middlewares/bigPromise.js"
import { User } from "../models/user.js"
import bcrypt from "bcryptjs"
import CustomError from "../utils/customError.js"
import cookieToken from "../utils/cookieToken.js"

export const signUp = BigPromise(async (req, res, next) => {
    
    const { firstName, lastName, email , password } = req.body

    if(!firstName || !lastName || !email || !password) {
        return new CustomError("Please provide all the detials", 400)
    }

    const user = await User.create({
        firstName,
        lastName,
        email,
        password
    })

    // cookieToken(user, res)
    const token = user.getJwtToken()

    const options = {
        expires: new Date(
            Date.now() + process.env.COOKIE_EXPIRY * 24 * 60 * 60 * 1000
        ),
        httpOnly: true
    }

    user.password = undefined

    res.cookie('token', token, options).redirect("/user/home")

    
})

export const homeRoute = BigPromise((req, res, next) => {
    res.render("home")
})