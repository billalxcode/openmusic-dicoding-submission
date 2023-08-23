import InvariantError from "../../exceptions/InvariantError.js";
import SongPayloadSchema from "./schema.js";

export default class SongValidator {
    validate(payload) {
        const result = SongPayloadSchema.validate(payload)
        if (result.error) {
            throw new InvariantError(result.error.message)
        }
        return result.value
    }
}