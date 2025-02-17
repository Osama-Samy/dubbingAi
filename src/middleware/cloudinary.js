import { v2 as cloudinary } from "cloudinary"
import dotenv from "dotenv"
dotenv.config()

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Middleware لرفع الملفات
export const uploadToCloudinary = (buffer) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            { resource_type: "auto" }, // Uploads all types of files automatically
            (error, result) => {
                if (error) reject(error)
                else resolve(result.secure_url)
            }
        )

        uploadStream.end(buffer)
    })
}