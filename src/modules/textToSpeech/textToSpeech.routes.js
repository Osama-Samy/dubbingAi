import { verifyToken } from "../../middleware/verifyToken.js"
import { textToSpeechEN, textToSpeechAR, getAllTextToSpeech, deleteOneTextToSpeech, changeName } from "./textToSpeech.controller.js";
import { Router } from "express"

const textToSpeechRouter = Router()

textToSpeechRouter.post("/text-to-speech-en", verifyToken, textToSpeechEN)

textToSpeechRouter.post("/text-to-speech-ar", verifyToken, textToSpeechAR)

textToSpeechRouter.get("/text-to-speech/:userId", verifyToken, getAllTextToSpeech)

textToSpeechRouter.delete("/text-to-speech/:textToSpeechId", verifyToken, deleteOneTextToSpeech)

textToSpeechRouter.patch("/text-to-speech/:textToSpeechId", verifyToken, changeName)

export default textToSpeechRouter