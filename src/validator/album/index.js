import InvariantError from "../../exceptions/InvariantError.js";
import AlbumPayloadSchema from "./schema.js";

export default class AlbumValidator {
    validate(payload) {
        const result = AlbumPayloadSchema.validate(payload)
        if (result.error) {
            throw new InvariantError(result.error.message)
        }
        return payload
    }
}