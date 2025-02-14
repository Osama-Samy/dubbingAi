import Speech from "../../../database/models/textToSpeech.model.js"
import axios from "axios"
import speechValidation from "./textToSpeech.validation.js"
import { connectCloudinary } from "../../middleware/cloudinary.js"


// English Text to Speech
const textToSpeechEN = async (req, res) => {
    const {error} = speechValidation.validate(req.body)
    if (error) {
        return res.status(400).json({message: error.details[0].message})
    } else {
    try {
    const { text, userId } = req.body
    if (!text || !userId) return res.status(400).json({ error: "Text and userId are required" })

    // Send text to AI API
    const aiResponse = await axios.post("https://api.example.com/text-to-speech", { text }, { responseType: "arraybuffer" })

    if (!aiResponse.data) return res.status(500).json({ error: "AI model failed to generate speech." })

    // Upload audio file to Cloudinary
    const uploadResponse = await connectCloudinary.uploader.upload_stream({ resource_type: "video" },
        async (error, result) => {
        if (error) return res.status(500).json({ error: "Cloudinary upload failed try again later" })

        // Save data to Database
        const newSpeech = new Speech({ userId, text, audioUrl: result.secure_url })
        await newSpeech.save()

        res.json({ message: "Speech generated successfully", audioUrl: result.secure_url })
        })

    uploadResponse.end(aiResponse.data)

    } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Something went wrong." })
    }
    }
}

// get all text to speech of a user
const getAllTextToSpeech = async (req, res) => {
    try {
        const speech = await Speech.find({ userId: req.params.userId })
        res.json(speech)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Something went wrong." })
    }
}

// Delete one text to speech of a user
const deleteOneTextToSpeech = async (req, res) => {
    try {
        const speech = await Speech.findByIdAndDelete(req.params.textToSpeechId)
        res.json(speech)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Something went wrong." })
    }       
}

// change name of a text to speech
const changeName = async (req, res) => {
    try {
        const speech = await Speech.findByIdAndUpdate(req.params.textToSpeechId, { name: req.body.name }, { new: true })
        res.json(speech)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Something went wrong." })
    }
    }

// Arabic Text to Speech
// const textToSpeechAR = async (req, res) => {
//     const {error} = speechValidation.validate(req.body)
//     if (error) {
//         return res.status(400).json({message: error.details[0].message})
//     } else {
//     try {
//     const { text, userId } = req.body
//     if (!text || !userId) return res.status(400).json({ error: "Text and userId are required." })

//     // Send text to AI API
//     const aiResponse = await axios.post("https://api.example.com/text-to-speech", { text }, { responseType: "arraybuffer" })

//     if (!aiResponse.data) return res.status(500).json({ error: "AI model failed to generate speech." })

//     // Upload audio file to Cloudinary
//     const uploadResponse = await connectCloudinary.uploader.upload_stream({ resource_type: "video" },
//         async (error, result) => {
//         if (error) return res.status(500).json({ error: "Cloudinary upload failed." })

//         // Save data to Database
//         const newSpeech = new Speech({ userId, text, audioUrl: result.secure_url })
//         await newSpeech.save()

//         res.json({ message: "Speech generated successfully.", audioUrl: result.secure_url })
//         })

//     uploadResponse.end(aiResponse.data)

//     } catch (error) {
//     console.error(error)
//     res.status(500).json({ error: "Something went wrong." })
//     }
//     }
// }

export { 
    textToSpeechEN,
    getAllTextToSpeech,
    deleteOneTextToSpeech,
    changeName
}