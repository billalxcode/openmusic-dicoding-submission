import ClientError from "./ClientError.js";

export default class NotFoundError extends ClientError {
    constructor(message) {
        super(message)

        this.name = "NotFound"
    }
}