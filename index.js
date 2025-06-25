/**
 * =========================================
 *  DubMaster AI
 *  Developed by Osama Samy
 * =========================================
 */
import express from "express"
import userRouter from "./src/modules/user/user.routes.js"
import { connectDB } from "./database/dbCon.js"
import textToSpeechRouter from "./src/modules/textToSpeech/textToSpeech.routes.js"
import dotenv from "dotenv"
import videoDubbingRouter from "./src/modules/videoDubbing/VideoDubbing.routes.js"
import videoSubtitleRouter from "./src/modules/VideoSubtitle/videoSubtitle.routes.js"
dotenv.config()

const app = express()
app.use(express.json())

app.use("/user", userRouter)
app.use("/speech", textToSpeechRouter)
app.use("/subtitle", videoSubtitleRouter)
app.use("/dubbing", videoDubbingRouter)


app.use("*", (req, res) => {
    res.status(404).send({message: "Page Not Found"})
})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log("Server is running Successfully")
})