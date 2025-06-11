import axios from "axios"
import { uploadToCloudinary } from "../../middleware/cloudinary.js"
import { VideoDubbing } from "../../../database/models/videoDubbing.js"

// Process video and upload to Cloudinary
const videoDubbing = async (req, res) => {
    const userId = req.userId
    if (!userId) {
        return res.status(401).json({ error: "User authentication required." })
    }

    if (!req.file) {
        return res.status(400).json({ error: "No video file uploaded." })
    }

    try {
        const videoBuffer = req.file.buffer

        // Send the video to the AI API for processing
        const aiResponse = await axios.post(
            "https://api.example.com/video-processing",
            videoBuffer,
            {
                headers: { 'Content-Type': 'video/mp4' },
                responseType: "arraybuffer",
                timeout: 30000 // 30 seconds timeout
            }
        )
        res.json({
            success: true,
            aiResult: aiResponse.data
        })

        if (!aiResponse.data) {
            throw new Error("AI model failed to process the video.")
        }

        // Upload the processed video to Cloudinary and get public_id
        const { public_id, secure_url } = await uploadToCloudinary(
            aiResponse.data,
            "video",
            { resource_type: "video", folder: "dubbing_videos" }
        )

        // Save video data in MongoDB in the background
        VideoDubbing.create({
            userId,
            videoUrl: secure_url,
            public_id
        })

    } catch (error) {
        res.status(error.response?.status || 500).json({
            error: error.response?.data?.message || "Failed to process the video."
        })
    }
}

// Delete video from Cloudinary and MongoDB
const deleteVideoDubbing = async (req, res) => {
    try {
        // Ensure the video belongs to the authenticated user
        const video = await VideoDubbing.findOne({
            _id: req.params.videoDubbingId,
            userId: req.userId
        })

        if (!video) {
            return res.status(404).json({ error: "Video not found or access denied." })
        }

        await cloudinary.uploader.destroy(video.public_id)
        await VideoDubbing.deleteOne({ _id: video._id })

        res.json({ success: true, message: "Video deleted successfully." })

    } catch (error) {
        res.status(500).json({ error: "Failed to delete the video. Please try again." })
    }
}

// Get all video dubbing records for the user, with pagination
const getAllVideoDubbing = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 10
        const skip = (page - 1) * limit

        const videos = await VideoDubbing.find({ userId: req.userId })
            .select("-public_id -__v")
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 })

        const total = await VideoDubbing.countDocuments({ userId: req.userId })

        res.json({
            page,
            totalPages: Math.ceil(total / limit),
            data: videos
        })

    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve videos." })
    }
}

// Change the name/title of a video dubbing record
const changeName = async (req, res) => {
    const { name } = req.body
    if (!name?.trim()) {
        return res.status(400).json({ error: "Name is required." })
    }

    try {
        // Ensure the video belongs to the authenticated user
        const video = await VideoDubbing.findOneAndUpdate(
            {
                _id: req.params.videoDubbingId,
                userId: req.userId
            },
            { name },
            { new: true, runValidators: true }
        ).select("-public_id -__v")

        if (!video) {
            return res.status(404).json({ error: "Video not found or access denied." })
        }

        res.json({ success: true, data: video })

    } catch (error) {
        res.status(500).json({ error: "Failed to update the name." })
    }
}

export {
    videoDubbing,
    deleteVideoDubbing,
    getAllVideoDubbing,
    changeName
}
