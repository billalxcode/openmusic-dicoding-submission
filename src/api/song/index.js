const { Server } = require("@hapi/hapi")
const SongHandler = require("./handler")
const SongRouter = require("./router")

module.exports = {
    name: "song",
    version: "1.0.0",

    /**
     * 
     * @param {Server} server 
     * @param {*} options 
     */
    register: async (server, options) => {
        const validator = options.validator
        const service = options.service

        const handler = new SongHandler(service, validator)
        const router = new SongRouter()

        server.route(router.run(handler))
    }
}