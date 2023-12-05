const Hapi = require("@hapi/hapi")
const AuthHandler = require("./handler")
const AuthRouter = require("./router")

module.exports = {
    name: "authentications",
    version: "1.0.0",

    /**
     * 
     * @param {Hapi.Server} server
     * @param {*} options
     */
    register: async (server,  options = {
        authService,
        userService,
        tokenManager,
        validator
    }) => {
        const handler = new AuthHandler(
            options.authService,
            options.userService,
            options.tokenManager,
            options.validator
        )
        const router = new AuthRouter()

        server.route(router.run(handler))
    }
}