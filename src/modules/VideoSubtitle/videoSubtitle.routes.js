import { Router } from "express"
import { verifyToken } from "../../middleware/verifyToken.js"
import { deleteOneVideoSubtitle, videoSubtitle, changeName, getAllVideoSubtitles } from "./videoSubtitle.controller.js"
import { upload } from "../../middleware/multer.js"

const videoSubtitleRouter = Router()

videoSubtitleRouter.post("/video-subtitle", verifyToken, upload.single('file'), videoSubtitle)

videoSubtitleRouter.get("/video-subtitle", verifyToken, getAllVideoSubtitles)

videoSubtitleRouter.patch("/video-subtitle/:videoSubtitleId", verifyToken, changeName)

videoSubtitleRouter.delete("/video-subtitle/:videoSubtitleId", verifyToken, deleteOneVideoSubtitle)

export default videoSubtitleRouter
