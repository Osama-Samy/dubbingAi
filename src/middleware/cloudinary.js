import { v2 as cloudinary } from "cloudinary"
import dotenv from "dotenv"
dotenv.config()

// Configure Cloudinary using environment variables
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})


export const uploadToCloudinary = async (buffer, extension = "mp3", options = {}) => {
    const mimeTypes = {
        mp3: "audio/mpeg",
        wav: "audio/wav",
        mp4: "video/mp4",
        webm: "video/webm"
    }

    const mimeType = mimeTypes[extension] || "application/octet-stream"
    const base64Data = buffer.toString("base64")
    const dataURI = `data:${mimeType};base64,${base64Data}`

    return await cloudinary.uploader.upload(dataURI, {
        resource_type: mimeType.startsWith("video") ? "video" : "auto",
        ...options
    })
}

