import { Router } from "express"
import { verifyToken } from "../../middleware/verifyToken.js"
import { deleteVideoSubtitle, videoSubtitle, getAllVideoSubtitle, changeName } from "./videoSubtitle.controller.js"
import { upload } from "../../middleware/multer.js"

const videoSubtitleRouter = Router()

videoSubtitleRouter.post("/video-subtitle", verifyToken, upload.single('video'), videoSubtitle)

videoSubtitleRouter.get("/video-subtitle/:userId", verifyToken, getAllVideoSubtitle)

videoSubtitleRouter.patch("/video-subtitle/:videoSubtitleId", verifyToken, changeName)

videoSubtitleRouter.delete("/video-subtitle/:videoSubtitleId", verifyToken, deleteVideoSubtitle)

export default videoSubtitleRouter
