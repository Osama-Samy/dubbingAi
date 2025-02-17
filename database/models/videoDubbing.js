import mongoose from "mongoose"

const videoDubbingSchema = new mongoose.Schema({
userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
},

name: { 
    type: String, 
    required: true,
    default: "Untitled",
    max:50
},

videoUrl: { 
    type: String, 
    required: true 
}

},
{ timestamps: true })

export const  VideoDubbing = mongoose.model("VideoDubbing", videoDubbingSchema )