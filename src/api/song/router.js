const BaseRouter = require("../../base/router");
const SongHandler = require("./handler");

class SongRouter extends BaseRouter {
    /**
     * 
     * @param {SongHandler} handler 
     */
    run(handler) {
        this.post("/songs", (r, h) => handler.postSongHandler(r, h))
        this.get("/songs", (r, h) => handler.getSongsHandler(r, h))
        this.get("/songs/{songId}", (r, h) => handler.getSongById(r, h))
        return this.router
    }
}

module.exports = SongRouter