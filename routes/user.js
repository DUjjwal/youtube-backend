import express from "express"
import { follow, homeRoute, login, signUp } from "../controllers/userController.js"
import { isLoggedIn } from "../middlewares/isLoggedIn.js"
const router = express.Router()


router.route("/signup").post(signUp)
router.route("/login").post(login)
router.route("/home").get(isLoggedIn, homeRoute)
router.route("/follow/:user").get(isLoggedIn, follow)

export default router