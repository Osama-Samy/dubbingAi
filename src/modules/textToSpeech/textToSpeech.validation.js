import Joi from "joi"

const speechValidation = Joi.object().keys({
    text: Joi.string().required(),
    userId: Joi.string().required(),
    audioUrl: Joi.string().required()
})

export default speechValidation