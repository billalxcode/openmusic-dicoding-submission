const BaseRouter = require("../../base/router");
const PlaylistSongHandler = require("./handler");

class PlaylistSongRouter extends BaseRouter {
    /**
     * 
     * @param {PlaylistSongHandler} handler 
     */
    run(handler) {
        this.setAuth("openmusic_jwt")
        this.post("/playlists/{playlistId}/songs", (r, h) => handler.postSongHandler(r, h))
        return this.router
    }
}

module.exports = PlaylistSongRouter