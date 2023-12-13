const Joi = require("joi")

const PostCollaborationSchema = Joi.object({
    playlistId: Joi.string().required(),
    userId: Joi.string().required()
})

module.exports = { PostCollaborationSchema }