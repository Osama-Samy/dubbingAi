import Joi from "joi"

const speechValidation = Joi.object().keys({
    text: Joi.string().required(),
    language: Joi.string().valid("en", "ar").required()
})

export default speechValidation