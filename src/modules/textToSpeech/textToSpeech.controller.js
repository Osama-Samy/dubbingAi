import Speech from "../../../database/models/textToSpeech.model.js"
import axios from "axios"
import speechValidation from "./textToSpeech.validation.js"
import { uploadToCloudinary } from "../../middleware/cloudinary.js"

// Unified Text-to-Speech handler that selects model/API based on language
const textToSpeech = async (req, res) => {
    // Validate request body
    const { error } = speechValidation.validate(req.body)
    if (error) {
        return res.status(400).json({ message: error.details[0].message })
    }

    const { text } = req.body
    const userId = req.userId
    const language = req.body.language

    if (!text || !userId) {
        return res.status(400).json({ error: "Text and userId are required" })
    }

    try {
        let aiResponse

        // Select TTS model/API based on language
        if (language === "en") {
            // English API
            aiResponse = await axios.post(
                "https://english-tts-api.example.com/generate",
                { text },
                {
                    responseType: "arraybuffer",
                    timeout: 10000
                }
            )
            res.json({
            success: true,
            aiResult: aiResponse.data
        })
        } else if (language === "ar") {
            // Arabic API
            aiResponse = await axios.post(
                "https://arabic-tts-api.example.com/generate",
                { text },
                {
                    responseType: "arraybuffer",
                    timeout: 10000
                }
            )
            res.json({
            success: true,
            aiResult: aiResponse.data
        })
        } else {
            return res.status(400).json({ error: "Unsupported language" })
        }

        if (!aiResponse.data) {
            throw new Error("Failed to generate audio from AI service")
        }

        // Upload audio file to Cloudinary
        const { public_id, secure_url } = await uploadToCloudinary(
            aiResponse.data,
            "audio/wav",
            { resource_type: "audio", folder: "text_to_speech" }
        )
        

        // Save record in the database in the background
        Speech.create({
            userId,
            text,
            audioUrl: secure_url,
            public_id
        })

    } catch (error) {
        res.status(error.response?.status || 500).json({
            error: error.response?.data?.message || "Internal server error"
        })
    }
}

// Get all TTS records for the authenticated user
const getAllTextToSpeech = async (req, res) => {
    try {
        const speeches = await Speech.find({ userId: req.userId })
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
                userId: req.userId
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
