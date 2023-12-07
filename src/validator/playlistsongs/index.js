const InvariantError = require("../../exceptions/InvariantError")
const { PlaylistSongSchema } = require("./schema")

class PlaylistSongValidator {
    validatePayload(payload) {
        const validationResult = PlaylistSongSchema.validate(payload)
        if (validationResult.error) {
            throw new InvariantError(validationResult.error.message)
        }
        return validationResult.value
    }
}

module.exports = PlaylistSongValidator