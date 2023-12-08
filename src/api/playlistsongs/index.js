const Hapi = require("@hapi/hapi")
const PlaylistSongHandler = require("./handler")
const PlaylistSongRouter = require("./router")

module.exports = {
    name: "playlistsongs",
    version: "1.0.0",

    /**
     * 
     * @param {Hapi.Server} server
     * @param {*} options
     */
    register: async (server, options) => {
        const handler = new PlaylistSongHandler(
            options.playlistSongService,
            options.songService,
            options.playlistService,
            options.validator
        )
        const router = new PlaylistSongRouter()

        server.route(router.run(handler))
    }
}