import { Router } from "express"
import { signup, login, verifyEmail, forgotPassword, verifyOTP, resetPassword } from "./user.controller.js"

const userRouter = Router()

userRouter.post('/signup', signup)
userRouter.post('/login', login)
userRouter.get('/verifyEmail/:token', verifyEmail)

userRouter.post("/forgot-password", forgotPassword)
userRouter.post("/verify-otp", verifyOTP)
userRouter.post("/reset-password", resetPassword)


export default userRouter