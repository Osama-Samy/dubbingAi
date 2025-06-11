import axios from "axios"
import { uploadToCloudinary } from "../../middleware/cloudinary.js"
import { VideoSubtitle } from "../../../database/models/videoSubtitle.js"

// Process video for subtitles and upload to Cloudinary
const videoSubtitle = async (req, res) => {
    const userId = req.userId
    if (!userId) return res.status(401).json({ error: "User authentication required." })
    if (!req.file) return res.status(400).json({ error: "No video file uploaded." })

    try {
        // Process video via AI API
        const aiResponse = await axios.post(
            "https://api.example.com/video-processing",
            req.file.buffer,
            {
                headers: { 'Content-Type': 'video/mp4' },
                responseType: "arraybuffer",
                timeout: 45000
            }
        )
        res.json({
            success: true,
            aiResult: aiResponse.data
        })

        // Upload processed video to Cloudinary
        const { public_id, secure_url } = await uploadToCloudinary(
            aiResponse.data,
            "video",
            { resource_type: "video", folder: "subtitled_videos" }
        )


        // Save video data to MongoDB in the background (do not await)
        VideoSubtitle.create({
            userId,
            videoUrl: secure_url,
            public_id
        })

    } catch (error) {
        const status = error.response?.status || 500
        const message = error.response?.data?.message || "Failed to process the video."
        res.status(status).json({ error: message })
    }
}

// Delete video subtitle from Cloudinary and MongoDB
const deleteVideoSubtitle = async (req, res) => {
    try {
        const video = await VideoSubtitle.findOneAndDelete({
            _id: req.params.id,
            userId: req.userId
        })
        if (!video) return res.status(404).json({ error: "Video not found." })

        await cloudinary.uploader.destroy(video.public_id, { resource_type: "video" })

        res.json({ success: true, message: "Video deleted successfully." })

    } catch (error) {
        res.status(500).json({ error: "Error deleting the video." })
    }
}

// Get all video subtitle records for the user with pagination
const getAllVideoSubtitle = async (req, res) => {
    try {
        const page = Math.max(1, parseInt(req.query.page) || 1)
        const limit = Math.min(50, parseInt(req.query.limit) || 10)

        const result = await VideoSubtitle.paginate(
            { userId: req.userId },
            { page, limit, sort: { createdAt: -1 }, select: "-public_id -__v" }
        )

        res.json({
            page: result.page,
            totalPages: result.totalPages,
            totalItems: result.totalDocs,
            data: result.docs
        })

    } catch (error) {
        res.status(500).json({ error: "Error retrieving videos." })
    }
}

// Change the name/title of a video subtitle record
const changeName = async (req, res) => {
    try {
        const { name } = req.body
        if (!name?.trim()) return res.status(400).json({ error: "Name is required." })

        const video = await VideoSubtitle.findOneAndUpdate(
            { _id: req.params.id, userId: req.userId },
            { name },
            { new: true, runValidators: true }
        ).select("-public_id -__v")

        if (!video) return res.status(404).json({ error: "Video not found." })

        res.json({ success: true, data: video })

    } catch (error) {
        res.status(500).json({ error: "Error updating the name." })
    }
}

export {
    videoSubtitle,
    deleteVideoSubtitle,
    getAllVideoSubtitle,
    changeName
}
