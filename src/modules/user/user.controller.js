import { User } from "../../../database/models/user.model.js"
import userValidation from "./user.validation.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { sendOTP } from "../../middleware/sendOtp.js"
import { sendEmail } from "../../middleware/sendEmail.js"

import dotenv from "dotenv"
dotenv.config()


const signup = async (req, res) => {

    const {error} = userValidation.validate(req.body)
    if (error) {
        return res.status(400).json({message: error.details[0].message})
    } else {
        
    try {
        let user = new User(req.body)
        
        // check if email already exists
        const emailExist = await User.findOne({email: req.body.email})
        if (emailExist) {
            return res.status(400).send({message: "Email already exists"})
        }

        sendEmail(req.body.email)
        await user.save()
        res.status(200).send({message: "User created"})
        }
        catch (error) {
            res.status(400).send({message: error.message})
        }
    }

}


const login = async (req, res) => {

    try {
        let user = await User.findOne({email: req.body.email})
        const isMatch = await bcrypt.compare(req.body.password, user.password)
        if (!isMatch) {
            return res.status(400).send({ message: "Wrong password" })
        }
        if (user.confirmEmail === false) {
            return res.status(400).send({message: "Please verify your email"})
        }
        jwt.sign({userId: user._id, username: user.username}, "process.env.KEY", (err, token) => {
            res.status(200).json({message: "Login successful", token})
        })
    }

    catch (error) {
        res.status(400).send({message: error.message})
    }
}

const verifyEmail = async (req, res) => {
    try{
    jwt.verify(req.params.token, "process.env.KEY", async (err, decoded) => {
        await User.findOneAndUpdate({email: decoded.email}, {confirmEmail: true})
        res.status(200).send({message: "Email verified successfully"})
        })
    }
    catch (error) {
        res.status(400).send({message: error.message})
    }
    
}

// send OTP
const forgotPassword = async (req, res) => {
    const { email } = req.body

    const user = await User.findOne({ email })
    if (!user) return res.status(400).json({ message: "User not found" })
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpToken = jwt.sign({ email, otp }, process.env.KEY, { expiresIn: "5m" })

    try {
    await sendOTP(email, otp)
    res.json({ message: "OTP sent successfully", token: otpToken })
    } catch (error) {
    res.status(500).json({ message: "Error sending OTP", error })
    }
}

  // verify OTP
const verifyOTP = async (req, res) => {
    const { otp } = req.body
    let { token } = req.headers

    try {
    const decoded = jwt.verify(token, process.env.KEY)
    if (decoded.otp !== otp) return res.status(400).json({ message: "Wrong OTP" })

    const resetToken = jwt.sign({ email: decoded.email }, process.env.KEY, { expiresIn: "5m" })
    res.json({ message: "OTP verified successfully", resetToken })
    } catch (error) {
    res.status(400).json({ message: "OTP expired or invalid" })
    }
}

  // reset password
const resetPassword = async (req, res) => {
    const { newPassword } = req.body
    let { token } = req.headers

    try {
    const decoded = jwt.verify(token, process.env.KEY)
    const hashedPassword = await bcrypt.hash(newPassword, 10)

    await User.updateOne({ email: decoded.email }, { password: hashedPassword })
    res.json({ message: "Password updated successfully" })
    } catch (error) {
    res.status(400).json({ message: "Invalid or expired token", error })
    }
} 

// get userName of a user
const getUserName = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId)
        res.json(user.username)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Something went wrong." })
    }
}

export {
    signup,
    login,
    verifyEmail,
    forgotPassword,
    verifyOTP,
    resetPassword,
    getUserName
}