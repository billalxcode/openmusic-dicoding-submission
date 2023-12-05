const { Server } = require("@hapi/hapi")
const UserRouter = require("./router")
const UserHandler = require("./handler")

module.exports = {
    name: "user",
    version: "1.0.0",

    /**
     * 
     * @param {Server} server
     * @param {*} options
     */
    register: async (server, options) => {
        const validator = options.validator
        const service = options.service
        
        const handler = new UserHandler(service, validator)
        const router = new UserRouter()

        server.route(router.run(handler))
    }
}