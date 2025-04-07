import express from "express"
import dotenv from "dotenv/config"
import morgan from "morgan"
import router from "./routes/user.js"
import connectDB from "./config/database.js"
import cookieParser from "cookie-parser"

connectDB()

const app = express()

app.set('view engine', 'ejs')
app.use(cookieParser())
app.use(express.json())
app.use(morgan('tiny'))
app.use(express.urlencoded({extended: true}))

app.use("/user", router)


app.get("/", (req, res) => {
    res.send("Welcome to home page")
})

export default app