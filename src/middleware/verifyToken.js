import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()

export const verifyToken = (req, res, next) => {
    let {token} = req.headers
    jwt.verify(token, process.env.KEY, async (err, decoded) => {
        if (err) {
            return res.status(400).send({message: "invalid token"})
        }
        req.user = decoded
        next()
    })
}