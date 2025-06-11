import mongoose from "mongoose"

const textToSpeechSchema = new mongoose.Schema({
userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
},

text: { 
    type: String, 
    required: true 
},

name: { 
    type: String, 
    required: true,
    default: "Untitled",
    max:50
},

audioUrl: { 
    type: String, 
    required: true 
},
public_id: { 
    type: String, 
    required: true 
}
},
{ timestamps: true })

const Speech = mongoose.model("Speech", textToSpeechSchema)
export default Speech