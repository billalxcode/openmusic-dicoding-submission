const BaseRouter = require("../../base/router");
const SongHandler = require("./handler");

class SongRouter extends BaseRouter {
    /**
     * 
     * @param {SongHandler} handler 
     */
    run(handler) {
        this.post("/songs", (r, h) => handler.postSongHandler(r, h))

        return this.router
    }
}

module.exports = SongRouter