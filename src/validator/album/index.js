import AlbumPayloadSchema from "./schema.js";

export default class AlbumValidator {
    validate(payload) {
        const result = AlbumPayloadSchema.validate(payload)
        if (result.error) {
            throw new Error(result.error.message)
        }
    }
}