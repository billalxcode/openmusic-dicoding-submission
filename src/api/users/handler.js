const Hapi = require("@hapi/hapi")
const UserService = require("../../service/postgresql/user")
const UserValidator = require("../../validator/user")

class UserHandler {
    /**
     * 
     * @param {UserService} service 
     * @param {UserValidator} validator 
     */
    constructor(service, validator) {
        this._service = service
        this._validator = validator
    }

    /**
     * 
     * @param {Hapi.Request} request
     * @param {Hapi.ResponseToolkit} h
     * @returns
     */
    async postUserHandler(request, h) {
        this._validator.validateUserPayload(request.payload)

        const { username, password, fullname } = request.payload
        const userId = await this._service.addUser({ username, password, fullname })

        const response = h.response({
            status: "success",
            message: "user berhasil ditambahkan",
            data: {
                userId
            }
        })
        response.code(201)
        return response
    }
}

module.exports = UserHandler