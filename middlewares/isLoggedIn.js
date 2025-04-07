import CustomError from "../utils/customError.js"
import { User } from "../models/user.js"
import jwt from "jsonwebtoken"

export const isLoggedIn = async (req, res, next) => {
    const token  =  req.cookies.token || req.body.token 

    if(!token) {
        return next(new CustomError("token not found", 400))
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    req.user = await User.findById(decoded.id)

    next()
}