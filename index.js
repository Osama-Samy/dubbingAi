import express from "express"
import userRouter from "./src/modules/user/user.routes.js"
import { connectDB } from "./database/dbCon.js"
import dotenv from "dotenv"
dotenv.config()

const app = express()
app.use(express.json())

app.use("/user", userRouter)

app.use("*", (req, res) => {
    res.status(404).send({message: "Page Not Found"})
})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log("Server is running Successfully")
})