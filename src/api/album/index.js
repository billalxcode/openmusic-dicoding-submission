const { Server } = require("@hapi/hapi")
const AlbumRouter = require("./router")
const AlbumHandler = require("./handler")

module.exports = {
    name: "album",
    version: "1.0.0",

    /**
     * 
     * @param {Server} server 
     * @param {*} options 
     */
    register: async (server, options) => {
        const validator = options.validator
        const service = options.service

        const handler = new AlbumHandler(service, validator)
        const router = new AlbumRouter()

        server.route(router.run(handler))
    }
}