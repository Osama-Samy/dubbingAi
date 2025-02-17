import { Router } from "express"
import { verifyToken } from "../../middleware/verifyToken.js"
import { getAllVideoDubbing, videoDubbing, deleteVideoDubbing, changeName } from "./VideoDubbing.controller.js"
import { upload } from "../../middleware/multer.js"

const videoDubbingRouter = Router()

videoDubbingRouter.post("/video-dubbing", verifyToken, upload.single('video'), videoDubbing)

videoDubbingRouter.get("/video-dubbing/:userId", verifyToken, getAllVideoDubbing)

videoDubbingRouter.patch("/video-dubbing/:videoDubbingId", verifyToken, changeName)

videoDubbingRouter.delete("/video-dubbing/:videoDubbingId", verifyToken, deleteVideoDubbing)

export default videoDubbingRouter
