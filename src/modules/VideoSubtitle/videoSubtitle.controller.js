import axios from "axios"
import { uploadToCloudinary } from "../../middleware/cloudinary.js"
import { VideoSubtitle } from "../../../database/models/videoSubtitle.js"

// Process video and upload to Cloudinary
const videoSubtitle = async (req, res) => {

    let userId = req.userId
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
        const newVideo = new VideoSubtitle({ userId, videoUrl })
        await newVideo.save()

        res.json({ message: "Video processed and uploaded successfully", videoUrl })

    } catch (error) {
        res.status(500).json({ error: "Something went wrong." })
    }
}

// Delete video from Cloudinary and MongoDB
const deleteVideoSubtitle = async (req, res) => {
    try {
        const video = await videoSubtitle.findById(req.params.videoSubtitleId)

        if (!video) {
            return res.status(404).json({ error: "Video not found." })
        }

        const public_id = video.videoUrl.split("/").pop().split(".")[0]

        await cloudinary.uploader.destroy(public_id)

        await VideoSubtitle.findByIdAndDelete(req.params.videoSubtitleId)

        res.json({ message: "Deleted successfully"})
    } catch (error) {
        res.status(500).json({ error: "Something went wrong." })
    }
}

// Get all video subtitle of a user
const getAllVideoSubtitle = async (req, res) => {
    try {
        const video = await VideoSubtitle.find({ userId: req.userId })
        res.json(video)
    } catch (error) {
        res.status(500).json({ error: "Something went wrong." })
    }
}

// Change name of text to speech
const changeName = async (req, res) => {
    try {
        const video = await VideoSubtitle.findByIdAndUpdate(req.params.videoSubtitleId, { name: req.body.name }, { new: true })
        res.json({ message: "Name changed successfully" })
    } catch (error) {
        res.status(500).json({ error: "Something went wrong." })
    }
}

export { 
    videoSubtitle,
    deleteVideoSubtitle,
    getAllVideoSubtitle,
    changeName
}