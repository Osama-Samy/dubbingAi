import { textToSpeechEN, getAllTextToSpeech, deleteOneTextToSpeech, changeName} from "./textToSpeech.controller.js"
import { Router } from "express"

const textToSpeechRouter = Router()

textToSpeechRouter.post("/text-to-speech-en", textToSpeechEN)

textToSpeechRouter.get("/text-to-speech/:userId", getAllTextToSpeech)

textToSpeechRouter.delete("/text-to-speech/:textToSpeechId", deleteOneTextToSpeech)

textToSpeechRouter.patch("/text-to-speech/:textToSpeechId", changeName)
// textToSpeechRouter.post("/text-to-speech-AR", textToSpeechEN)

export default textToSpeechRouter

