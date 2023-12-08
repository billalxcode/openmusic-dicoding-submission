const Hapi = require("@hapi/hapi")
const PlaylistHandler = require("./handler")
const PlaylistRouter = require("./router")

module.exports = {
    name: "playlist",
    version: "1.0.0",

    /**
     * 
     * @param {Hapi.Server} server 
     * @param {*} options 
     */
    register: async(server, options) => {
        const handler = new PlaylistHandler(
            options.playlistService,
            options.songService,
            options.validator
        )
        const router = new PlaylistRouter()

        server.route(router.run(handler))
    }
}