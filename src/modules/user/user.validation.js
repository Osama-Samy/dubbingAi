import Joi from "joi"

const userValidation = Joi.object().keys({
    username: Joi.string().min(3).max(25).required(),
    email: Joi.string().email().max(50).required(),
    confirmEmail: Joi.boolean(),
    password: Joi.string().min(6).max(100).required()
})

export default userValidation