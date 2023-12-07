const InvariantError = require("../../exceptions/InvariantError")
const { PlaylistPayloadSchema } = require("./schema")

class PlaylistValidator {
    validatePlaylistPayload(payload) {
        const validationResult = PlaylistPayloadSchema.validate(payload)

        if (validationResult.error) {
            throw new InvariantError(validationResult.error.message)
        }
        return validationResult.value
    }
}

module.exports = PlaylistValidator