import Speech from "../../../database/models/textToSpeech.model.js"
import axios from "axios"
import speechValidation from "./textToSpeech.validation.js"
import { uploadToCloudinary } from "../../middleware/cloudinary.js"
import dotenv from "dotenv"
dotenv.config()

const textToSpeech = async (req, res) => {
    const { error } = speechValidation.validate(req.body)
    if (error) {
        return res.status(400).json({ message: error.details[0].message })
    }

    const { text, language } = req.body
    const userId = req.user.userId
    if (!text || !userId) {
        return res.status(400).json({ error: "Text and userId are required" })
    }

    const apiKey = process.env.TTS_API_KEY
    const endpoint = process.env.TTS_API_ENDPOINT
    
    let selectedVoice = ""
    let langCode = ""

    if (language === "ar") {
        selectedVoice = "ar-EG-ShakirNeural"
        langCode = "ar-EG"
    } else if (language === "en") {
        selectedVoice = "en-US-GuyNeural"
        langCode = "en-US"
    } else {
        return res.status(400).json({ error: "Unsupported language" })
    }

    const ssml = `
<speak version='1.0' xml:lang='${langCode}'>
    <voice xml:lang='${langCode}' name='${selectedVoice}'>
    ${text}
    </voice>
</speak>`.trim()

    try {
        const response = await axios.post(endpoint, ssml, {
            headers: {
                "Ocp-Apim-Subscription-Key": apiKey,
                "Content-Type": "application/ssml+xml",
                "X-Microsoft-OutputFormat": "audio-16khz-32kbitrate-mono-mp3",
                "User-Agent": "text-to-speech-client"
            },
            responseType: "arraybuffer"
        })

        const audioBuffer = Buffer.from(response.data)

        const { public_id, secure_url } = await uploadToCloudinary(
            audioBuffer,
            "audio/mp3",
            { resource_type: "video", folder: "text_to_speech" }
        )

        await Speech.create({
            userId,
            text,
            audioUrl: secure_url,
            public_id
        })

        res.status(201).json({ success: true, audioUrl: secure_url })

    } catch (error) {
        res.status(error.response?.status || 500).json({
            error: "TTS request failed"
        })
    }
}


// Get all TTS records for the authenticated user
const getAllTextToSpeech = async (req, res) => {
    const userId = req.user.userId
    try {
        const speeches = await Speech.find({ userId })
            .select("-public_id -__v")
            .sort({ createdAt: -1 })

        res.json({ count: speeches.length, data: speeches })

    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve records" })
    }
}

// Delete a specific TTS record
const deleteOneTextToSpeech = async (req, res) => {
    try {
        // Find the record and ensure it belongs to the authenticated user
        const speech = await Speech.findOne({
            _id: req.params.textToSpeechId,
            userId: req.userId
        })

        if (!speech) {
            return res.status(404).json({ error: "Speech record not found" })
        }

        // Delete the audio file from Cloudinary
        await cloudinary.uploader.destroy(speech.public_id)

        // Delete the record from the database
        await Speech.deleteOne({ _id: speech._id })

        res.json({
            success: true,
            message: "Record deleted successfully"
        })

    } catch (error) {
        res.status(500).json({
            error: "Failed to delete record. Please try again."
        })
    }
}

// Change the name/title of a TTS record
const changeName = async (req, res) => {
    try {
        const { name } = req.body
        if (!name?.trim()) {
            return res.status(400).json({ error: "Name is required" })
        }

        // Update the record if it belongs to the authenticated user
        const updatedSpeech = await Speech.findOneAndUpdate(
            {
                _id: req.params.textToSpeechId,
                userId: req.user.userId
            },
            { name },
            { new: true, runValidators: true }
        ).select("-public_id -__v")

        if (!updatedSpeech) {
            return res.status(404).json({ error: "Record not found" })
        }

        res.json({
            success: true,
            data: updatedSpeech
        })

    } catch (error) {
        res.status(500).json({
            error: "Failed to update name. Please try again."
        })
    }
}

export {
    textToSpeech,
    getAllTextToSpeech,
    deleteOneTextToSpeech,
    changeName
}
