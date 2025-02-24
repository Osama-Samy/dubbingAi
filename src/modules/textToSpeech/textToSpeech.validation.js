import Joi from "joi"

const speechValidation = Joi.object().keys({
    text: Joi.string().required()
})

export default speechValidation