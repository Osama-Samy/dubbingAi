import axios from "axios"
import { uploadToCloudinary } from "../../middleware/cloudinary.js"
import VideoDubbingValidation from "./VideoDubbing.validation.js"
import { VideoDubbing } from "../../../database/models/videoDubbing.js"


// Process video and upload to Cloudinary
const videoDubbing = async (req, res) => {
    const { error } = VideoDubbingValidation.validate(req.body)
    if (error) {
        return res.status(400).json({ message: error.details[0].message })
    }

    const { userId } = req.body
    if (!userId) {
        return res.status(400).json({ error: "userId is required." })
    }

    try {
        // Get the video buffer from Multer
        const videoBuffer = req.file.buffer  // Video content

        // Send the video to the AI API for processing
        const aiResponse = await axios.post(
            "https://api.example.com/video-processing", 
            videoBuffer, 
            { headers: { 'Content-Type': 'video/mp4' }, responseType: "arraybuffer" }
        )

        if (!aiResponse.data) {
            return res.status(500).json({ error: "AI model failed to process video." })
        }

        // Upload the processed video to Cloudinary
        const videoUrl = await uploadToCloudinary(aiResponse.data)

        // Save video data in MongoDB
        const newVideo = new VideoDubbing({ userId, videoUrl })
        await newVideo.save()

        res.json({ message: "Video processed and uploaded successfully", videoUrl })

    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Something went wrong." })
    }
}

// Delete video from Cloudinary and MongoDB
const deleteVideoDubbing = async (req, res) => {
    try {
        const video = await VideoDubbing.findById(req.params.videoDubbingId)

        if (!video) {
            return res.status(404).json({ error: "Video not found." })
        }

        const public_id = video.videoUrl.split("/").pop().split(".")[0]

        await cloudinary.uploader.destroy(public_id)

        await VideoDubbing.findByIdAndDelete(req.params.videoDubbingId)

        res.json({ message: "Deleted successfully"})
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Something went wrong." })
    }
}

// Get all video dubbing
const getAllVideoDubbing = async (req, res) => {
    try {
        const video = await VideoDubbing.find({ userId: req.params.userId })
        res.json(video)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Something went wrong." })
    }
}

// Change name of text to speech
const changeName = async (req, res) => {
    try {
        const video = await VideoDubbing.findByIdAndUpdate(req.params.videoDubbingId, { name: req.body.name }, { new: true })
        res.json(video)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Something went wrong." })
    }
}

export { 
    videoDubbing,
    deleteVideoDubbing,
    getAllVideoDubbing,
    changeName
}
