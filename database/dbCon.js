import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()

export const connectDB = mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('Connected successfully to MongoDB')
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error.message)
    })      
