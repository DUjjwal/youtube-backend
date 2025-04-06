import mongoose from "mongoose"
import dotenv from "dotenv/config"

const connectDB = () => {
    mongoose.connect(process.env.DB_URL)
    .then(console.log(`DB Connected Successfully`))
    .catch(err => {
        console.log(`DB Connection Failed ${err}`)
        process.exit(1)
    })
}

export default connectDB