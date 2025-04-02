import { Router } from "express"
import { signup, login, verifyEmail, forgotPassword, verifyOTP, changePassword, getUser, updateUser, deleteUser } from "./user.controller.js"
import { verifyToken } from "../../middleware/verifyToken.js"

const userRouter = Router()

userRouter.post('/signup', signup)
userRouter.post('/login', login)
userRouter.get('/verifyEmail/:token', verifyEmail)

userRouter.post("/forgot-password", forgotPassword)
userRouter.post("/verify-otp", verifyOTP)
userRouter.post("/change-password", changePassword)

// get user data
userRouter.get("/getuser", verifyToken, getUser)

// update user data
userRouter.patch("/updateuser", verifyToken, updateUser)

userRouter.delete("/deleteuser", verifyToken, deleteUser)

export default userRouter