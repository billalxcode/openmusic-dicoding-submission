const BaseRouter = require("../../base/router");
const PlaylistSongHandler = require("./handler");

class PlaylistSongRouter extends BaseRouter {
    /**
     * 
     * @param {PlaylistSongHandler} handler 
     */
    run(handler) {
        this.post("/playlists/{id}/songs", (r, h))
        return this.router
    }
}

module.exports = PlaylistSongRouter