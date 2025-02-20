import Speech from "../../../database/models/textToSpeech.model.js"
import axios from "axios"
import speechValidation from "./textToSpeech.validation.js"
import { uploadToCloudinary } from "../../middleware/cloudinary.js"

// English Text to Speech
const textToSpeechEN = async (req, res) => {
    const { error } = speechValidation.validate(req.body)
    if (error) {
        return res.status(400).json({ message: error.details[0].message })
    }

    const text = req.body
    let userId = req.userId
    if (!text || !userId) {
        return res.status(400).json({ error: "Text and userId are required" })
    }
    
    try {
        // Send text to AI API
        const aiResponse = await axios.post(
            "https://api.example.com/text-to-speech",
            { text },
            { responseType: "arraybuffer" } // Set response type to arrayـBuffer
        )

        if (!aiResponse.data) {
            return res.status(500).json({ error: "AI model failed to generate speech." })
        }

        // Upload audio file to Cloudinary
        const audioUrl = await uploadToCloudinary(aiResponse.data)

        // Save data to Database
        const newSpeech = new Speech({ userId, text, audioUrl })
        await newSpeech.save()

        res.json({ message: "Speech generated successfully", audioUrl })

    } catch (error) {
        res.status(500).json({ error: "Something went wrong." })
    }
}

// Arabic Text to Speech
const textToSpeechAR = async (req, res) => {
    const { error } = speechValidation.validate(req.body)
    if (error) {
        return res.status(400).json({ message: error.details[0].message })
    }

    try {
        const text= req.body
        let userId = req.userId
        if (!text || !userId) {
            return res.status(400).json({ error: "Text and userId are required." })
        }

        // Send text to AI API
        const aiResponse = await axios.post(
            "https://api.example.com/text-to-speech",
            { text },
            { responseType: "arraybuffer" }
        )

        if (!aiResponse.data) {
            return res.status(500).json({ error: "AI model failed to generate speech." })
        }

        // Upload audio file to Cloudinary
        const audioUrl = await uploadToCloudinary(aiResponse.data)

        // Save data to Database
        const newSpeech = new Speech({ userId, text, audioUrl })
        await newSpeech.save()

        res.json({ message: "Speech generated successfully.", audioUrl })

    } catch (error) {
        res.status(500).json({ error: "Something went wrong." })
    }
}

// Get all text to speech
const getAllTextToSpeech = async (req, res) => {
    try {
        const speech = await Speech.find({ userId: req.userId })
        res.json(speech)
    } catch (error) {
        res.status(500).json({ error: "Something went wrong." })
    }
}

// Delete text to speech
const deleteOneTextToSpeech = async (req, res) => {
    try {
        const speech = await Speech.findById(req.params.textToSpeechId)

        if (!speech) {
            return res.status(404).json({ error: "Speech not found." })
        }

        // Get public_id from audioUrl to delete the file from Cloudinary
        const public_id = speech.audioUrl.split("/").pop().split(".")[0]

        // Delete file from Cloudinary using public_id
        await cloudinary.uploader.destroy(public_id)

        // Delete data from Database
        await Speech.findByIdAndDelete(req.params.textToSpeechId)

        res.json({ message: "Deleted successfully", speech })
    } catch (error) {
        res.status(500).json({ error: "Something went wrong." })
    }
}


// Change name of text to speech
const changeName = async (req, res) => {
    try {
        const speech = await Speech.findByIdAndUpdate(req.params.textToSpeechId, { name: req.body.name }, { new: true })
        res.json(speech)
    } catch (error) {
        res.status(500).json({ error: "Something went wrong." })
    }
}

export { 
    textToSpeechEN,
    textToSpeechAR,
    getAllTextToSpeech,
    deleteOneTextToSpeech,
    changeName
}
