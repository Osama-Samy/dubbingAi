import Joi from "joi"

const videoSubtitleValidation = Joi.object().keys({
    userId: Joi.string().required(),
    name: Joi.string().required().max(50),
    videoUrl: Joi.string().required()
})

export default videoSubtitleValidation