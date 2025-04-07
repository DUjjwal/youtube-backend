import express from "express"
import dotenv from "dotenv/config"
import morgan from "morgan"
import router from "./routes/user.js"
import videoRouter from "./routes/video.js"
import connectDB from "./config/database.js"
import cookieParser from "cookie-parser"
import cloudinary from "cloudinary"
import fileUpload from "express-fileupload"

connectDB()

const app = express()

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY, 
    api_secret: process.env.CLOUDINARY_SECRET
})

app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/"
}))

app.set('view engine', 'ejs')
app.use(cookieParser())
app.use(express.json())
app.use(morgan('tiny'))
app.use(express.urlencoded({extended: true}))

app.use("/user", router)
app.use("/video", videoRouter)


app.get("/", (req, res) => {
    res.send("Welcome to home page")
})

export default app