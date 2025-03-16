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
            return res.status(400).send({message: "Email already exists, please use a different email"})
        }

        sendEmail(req.body.email)
        await user.save()
        res.status(200).send({message: "User created, please check your email for verification"})
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

  // change password
const changePassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body
    let { token } = req.headers

    try {
        const decoded = jwt.verify(token, process.env.KEY)
        const user = await User.findOne({ email: decoded.email })

        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        const isMatch = await bcrypt.compare(oldPassword, user.password)
        if (!isMatch) {
            return res.status(400).json({ message: "Old password is incorrect" })
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10)
        await User.updateOne({ email: decoded.email }, { password: hashedPassword })

        res.json({ message: "Password updated successfully" })
    } catch (error) {
        res.status(400).json({ message: "Invalid or expired token", error })
    }
}

// get userName of a user
const getUser = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select("-password").select("-_id")
    if (!user) return res.status(404).json({ message: "User not found" })
        res.json(user)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}  

const updateUser = async (req, res) => {

    try {
    const { username, email } = req.body
    let user = await User.findById(req.userId)
    if (!user) return res.status(404).json({ message: "User not found" })

    if (username) user.username = username

    if (email) {
        
        // check if email already exists
        const emailExist = await User.findOne({email: req.body.email})
        if (emailExist) {
            return res.status(400).send({message: "Email already exists, please use a different email"})
        }
        user.email = email
        sendEmail(req.body.email)
    }
    
    await user.save()
    res.json({ message: "User updated successfully", user: {  
        username: user.username, 
        email: user.email 
    }})
    } catch (err) {
    res.status(500).json({ error: err.message })
    }
    }

export {
    signup,
    login,
    verifyEmail,
    forgotPassword,
    verifyOTP,
    changePassword,
    getUser,
    updateUser
}