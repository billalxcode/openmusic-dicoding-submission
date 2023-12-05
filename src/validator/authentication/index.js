const InvariantError = require("../../exceptions/InvariantError")
const { PostAuthPayloadSchema, PutAuthPayloadSchema, DeleteAuthPayloadSchema } = require("./schema")

class AuthenticationValidator {
    validatePostAuthPayload(payload) {
        const validationResult = PostAuthPayloadSchema.validate(payload)

        if (validationResult.error) {
            throw new InvariantError(validationResult.error.message)
        }
        return validationResult.value
    }

    validatePutAuthPayload(payload) {
        const validationResult = PutAuthPayloadSchema.validate(payload)
        if (validationResult.error) {
            throw new InvariantError(validationResult.error.message)
        }
        return validationResult.value
    }

    validateDeleteAuthPayload(payload) {
        const validationResult = DeleteAuthPayloadSchema.validate(payload)
        if (validationResult.error) {
            throw new InvariantError(validationResult.error.message)
        }
        return validationResult.value
    }
}

module.exports = AuthenticationValidator