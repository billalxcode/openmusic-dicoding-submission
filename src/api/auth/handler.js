const Hapi = require("@hapi/hapi")
const AuthService = require("../../service/postgresql/authentication")
const UserService = require("../../service/postgresql/user")
const TokenManager = require("../../tokenize/TokenManager")
const AuthValidator = require("../../validator/authentication")

class AuthHandler {
    /**
     * 
     * @param {AuthService} authService 
     * @param {UserService} userService 
     * @param {TokenManager} tokenManager 
     * @param {AuthValidator} validator 
     */
    constructor(
        authService, userService,
        tokenManager, validator
    ) {
        this._authService = authService
        this._userService = userService
        this._tokenManager = tokenManager
        this._validator = validator
    }

    /**
     * 
     * @param {Hapi.Request} request 
     * @param {Hapi.ResponseToolkit} h 
     */
    async postAuthenticationHandler(request, h) {
        this._validator.validatePostAuthPayload(request.payload)
        const { username, password } = request.payload
        const id = await this._userService.verifyUserCredential(username, password)
        const accessToken = this._tokenManager.generateAccessToken({ id })
        const refreshToken = this._tokenManager.generateRefreshToken({ id })
        
        await this._authService.addRefreshToken(refreshToken)

        const response = h.response({
            status: "success",
            message: "authentication berhasil ditambahkan",
            data: {
                accessToken,
                refreshToken
            }
        })
        response.code(201)
        return response
    }

    /**
     * 
     * @param {Hapi.Request} request 
     * @param {Hapi.ResponseToolkit} h 
     */
    async putAuthenticationHandler(request, h) {
        this._validator.validatePutAuthPayload(request.payload)

        const { refreshToken } = request.payload
        await this._authService.verifyRefreshToken(refreshToken)
        const { id } = this._tokenManager.verifyRefreshToken(refreshToken)
        
        const accessToken = this._tokenManager.generateAccessToken({ id })
        const response = h.response({
            status: "success",
            message: "Access token berhasil diperbaharui",
            data: {
                accessToken
            }
        })
        return response
    }

    /**
     * 
     * @param {Hapi.Request} request 
     * @param {Hapi.ResponseToolkit} h 
     */
    async deleteAuthenticationHandler(request, h) {
        this._validator.validateDeleteAuthPayload(request.payload)

        const { refreshToken } = request.payload
        await this._authService.verifyRefreshToken(refreshToken)
        await this._authService.deleteRefreshToken(refreshToken)

        const response = h.response({
            status: "success",
            message: "Refresh token berhasil dihapus"
        })
        return response
    }
}

module.exports = AuthHandler