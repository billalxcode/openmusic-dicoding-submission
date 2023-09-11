const ClientError = require("./ClientError");

class NotFoundError extends ClientError {
    constructor(message) {
        super(message)

        this.name = "NotFound"
        this.statusCode = 404
    }
}

module.exports = NotFoundError