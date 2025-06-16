import nodemailer from "nodemailer"
import dotenv from "dotenv"

dotenv.config()

const transporter = nodemailer.createTransport({

    service: "gmail",
    auth: {
    user: "osamaearnmoney11@gmail.com",
    pass: process.env.EMAIL_PASS,
},
})

export const sendOTP = async (email, otp) => {
const mailOptions = {
    from: '"Osama Samy"osamaearnmoney11@gmail.com',
    to: email,
    subject: "OTP Verification",
    text: `Your OTP is ${otp} (valid for 5 minutes)`,
}

await transporter.sendMail(mailOptions)
}
