import { verifyToken } from "../../middleware/verifyToken.js"
import { textToSpeech, getAllTextToSpeech, deleteOneTextToSpeech, changeName } from "./textToSpeech.controller.js";
import { Router } from "express"

const textToSpeechRouter = Router()

textToSpeechRouter.post("/text-to-speech", verifyToken, textToSpeech)

textToSpeechRouter.get("/text-to-speech", verifyToken, getAllTextToSpeech)

textToSpeechRouter.delete("/text-to-speech/:textToSpeechId", verifyToken, deleteOneTextToSpeech)

textToSpeechRouter.patch("/text-to-speech/:textToSpeechId", verifyToken, changeName)

export default textToSpeechRouter