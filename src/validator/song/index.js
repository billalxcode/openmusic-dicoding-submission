import InvariantError from "../../exceptions/InvariantError.js";
import { SongPayloadSchema, SongQuerySchema } from "./schema.js";

export default class SongValidator {
    validate(data, type = "payload") {
        if (type == "payload") {
            var result = SongPayloadSchema.validate(data)
        } else if (type == "query") {
            var result = SongQuerySchema.validate(data)
        }
        if (result.error) {
            throw new InvariantError(result.error.message)
        }
        return result.value
    }
}