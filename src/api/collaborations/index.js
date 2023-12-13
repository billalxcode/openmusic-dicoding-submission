const Hapi = require("@hapi/hapi")
const CollaborationHandler = require("./handler")
const CollaborationRouter = require("./router")

module.exports = {
    name: "collaboration",
    version: "1.0.0",

    /**
     * 
     * @param {Hapi.Server} server 
     * @param {*} options 
     */
    register: async(server, options) => {
        const handler = new CollaborationHandler(
            options.collaborationService,
            options.playlistService,
            options.validator
        )
        const router = new CollaborationRouter()
        server.route(router.run(handler))
    }
}