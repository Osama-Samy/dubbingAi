import axios from "axios"
import { uploadToCloudinary } from "../../middleware/cloudinary.js"
import { v2 as cloudinary } from "cloudinary"
import dotenv from "dotenv"
import { VideoSubtitle } from "../../../database/models/videoSubtitle.js"
import FormData from "form-data"

dotenv.config()

const videoSubtitle = async (req, res) => {
    const userId = req.user.userId

    if (!req.file || !userId) {
        return res.status(400).json({ error: "Video file and userId are required" })
    }

    try {
        // Prepare form-data as expected by the model
        const form = new FormData()
        form.append("file", req.file.buffer, {
            filename: "video.mp4",
            contentType: "video/mp4"
        })

        const response = await axios.post(
            process.env.SUBTITLE_API_ENDPOINT,
            form,
            {
                headers: {
                    ...form.getHeaders()
                },
                responseType: "arraybuffer"
            }
        )

        const videoBuffer = Buffer.from(response.data)

        const { public_id, secure_url } = await uploadToCloudinary(
            videoBuffer,
            "video/mp4",
            { resource_type: "video", folder: "subtitled_videos" }
        )

        await VideoSubtitle.create({
            userId,
            videoUrl: secure_url,
            public_id
        })

        res.status(201).json({ success: true, videoUrl: secure_url })

    } catch (error) {
        console.error("Subtitle Error:", error.message)
        res.status(500).json({ error: "Failed to generate subtitle video" })
    }
}

const getAllVideoSubtitles = async (req, res) => {
    const userId = req.user.userId
    try {
        const videos = await VideoSubtitle.find({ userId })
            .select("-public_id -__v")
            .sort({ createdAt: -1 })

        res.json({ count: videos.length, data: videos })

    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve videos" })
    }
}

const deleteOneVideoSubtitle = async (req, res) => {
    try {
        const userId = req.user.userId

        const video = await VideoSubtitle.findOne({
            _id: req.params.videoSubtitleId,
            userId
        })

        if (!video) {
            return res.status(404).json({ error: "Video not found" })
        }

        await cloudinary.uploader.destroy(video.public_id, { resource_type: "video" })

        await VideoSubtitle.deleteOne({ _id: video._id })

        res.json({
            success: true,
            message: "Video deleted successfully"
        })

    } catch (error) {
        console.error("Delete Error:", error)
        res.status(500).json({ error: "Failed to delete video. Please try again." })
    }
}

const changeName = async (req, res) => {
    try {
        const { name } = req.body
        if (!name?.trim()) {
            return res.status(400).json({ error: "Name is required" })
        }

        const updatedVideo = await VideoSubtitle.findOneAndUpdate(
            {
                _id: req.params.videoSubtitleId,
                userId: req.user.userId
            },
            { name },
            { new: true, runValidators: true }
        ).select("-public_id -__v")

        if (!updatedVideo) {
            return res.status(404).json({ error: "Video not found" })
        }

        res.json({
            success: true,
            data: updatedVideo
        })

    } catch (error) {
        res.status(500).json({ error: "Failed to update name. Please try again." })
    }
}

export {
    videoSubtitle,
    getAllVideoSubtitles,
    deleteOneVideoSubtitle,
    changeName
}
