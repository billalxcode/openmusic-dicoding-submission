const Joi = require("joi")

const currentYear = new Date().getFullYear()

const SongPayloadSchema = Joi.object({
    title: Joi.string().max(50).required(),
    year: Joi.number().integer().min(1900).max(currentYear),
    genre: Joi.string().max(50).required(),
    performer: Joi.string().max(50).required(),
    duration: Joi.number(),
    albumId: Joi.string()
})

module.exports = { SongPayloadSchema }