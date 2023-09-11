class ClientError extends Error {
    constructor(message, statusCode = 400) {
        super(message)

        this.statusCode = statusCode
        this.name = "ClientError"
    }

    getName() {
        return this.name
    }

    getStatusCode() {
        return this.statusCode
    }
}

module.exports = ClientError