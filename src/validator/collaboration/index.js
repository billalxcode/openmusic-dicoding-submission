const InvariantError = require("../../exceptions/InvariantError");
const { PostCollaborationSchema } = require("./schema");

class CollaborationValidator {
    validateCollaborationPayload(payload) {
        const validationResult = PostCollaborationSchema.validate(payload)
        if (validationResult.error) {
            throw new InvariantError(validationResult.error.message)
        }
        return validationResult.value
    }
}

module.exports = CollaborationValidator