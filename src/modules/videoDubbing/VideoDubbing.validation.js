import Joi from "joi"

const VideoDubbingValidation = Joi.object().keys({
    userId: Joi.string().required(),
    name: Joi.string().required().max(50),
    videoUrl: Joi.string().required()
})

export default VideoDubbingValidation