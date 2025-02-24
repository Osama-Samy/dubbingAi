import nodemailer from 'nodemailer'
import { emailHtml } from './emailHtml.js'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

export const sendEmail = async (email) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "0111317osama@gmail.com", 
                pass: process.env.EMAIL_PASS, 
            },
        })
        jwt.sign({email}, "process.env.KEY", async (err, token) => {
            const info = await transporter.sendMail({
                from: '"Osama Samy"0111317osama@gmail.com',
                to: email, 
                subject: "Hello, Please Verify DubMaster Ai Email✔", 
                html: emailHtml(token) 
            })
        })
    } catch (error) {
        res.status(400).send({message: error.message})
    }
}