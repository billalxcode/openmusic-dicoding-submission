const InvariantError = require("../../exceptions/InvariantError")
const { SongPayloadSchema } = require("./shema")

class SongValidator {
    validateSongPayload = (payload) => {
        const validationResult = SongPayloadSchema.validate(payload)

        if (validationResult.error) {
            throw new InvariantError(validationResult.error.message)
        }

        return validationResult.value
    }
}

module.exports = SongValidator