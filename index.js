import app from "./app.js";
import dotenv from "dotenv/config"



app.listen(process.env.PORT, () => {
    console.log(`Server is listening at PORT ${process.env.PORT}`)
})