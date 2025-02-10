import mongoose from "mongoose"
import bcrypt from "bcrypt"

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
        min: 3,
        max: 25
    },
    email: {
        type: String,
        unique: true,
        max: 50,
        required: true
    },
    password: {
        type: String,
        required: true,
        min: 6,
        max: 100
    },
    confirmEmail: {
        type: Boolean,
        default: false
    }
}, {timestamps: true, versionKey: false})

userSchema.pre('save', function () {
    this.password = bcrypt.hashSync(this.password, 10)
})

export const User = mongoose.model('User', userSchema)