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

    cookieToken(user, res)
    
})