import { Router } from "express"
import { verifyToken } from "../../middleware/verifyToken.js"
import { upload } from "../../middleware/multer.js"
import { videoDubbing, getAllVideoDubbing, deleteOneVideoDubbing, changeName } from "./VideoDubbing.controller.js"

const videoDubbingRouter = Router()

videoDubbingRouter.post("/video-subtitle", verifyToken, upload.single('file'), videoDubbing)

videoDubbingRouter.get("/video-subtitle", verifyToken, getAllVideoDubbing)

videoDubbingRouter.patch("/video-subtitle/:videoSubtitleId", verifyToken, changeName)

videoDubbingRouter.delete("/video-subtitle/:videoSubtitleId", verifyToken, deleteOneVideoDubbing)

export default videoDubbingRouter
