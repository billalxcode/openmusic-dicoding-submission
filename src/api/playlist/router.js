const BaseRouter = require("../../base/router")
const PlaylistHandler = require("./handler")

class PlaylistRouter extends BaseRouter {
    /**
     * 
     * @param {PlaylistHandler} handler 
     */
    run(handler) {
        this.setAuth("openmusic_jwt")
        this.get("/playlists", (r, h) => handler.getPlaylistsHandler(r, h))
        this.post("/playlists", (r, h) => handler.postPlaylistHandler(r, h))
        return this.router
    }
}

module.exports = PlaylistRouter