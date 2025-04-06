import express from "express"
import dotenv from "dotenv/config"
import morgan from "morgan"
import router from "./routes/user.js"
import connectDB from "./config/database.js"

connectDB()

const app = express()

app.use(express.json())
app.use(morgan('tiny'))

app.use("/user", router)


app.get("/", (req, res) => {
    res.send("Welcome to home page")
})

export default app