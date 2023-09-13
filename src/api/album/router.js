const BaseRouter = require("../../base/router");
const AlbumHandler = require("./handler");

class AlbumRouter extends BaseRouter {
    /**
     * 
     * @param {AlbumHandler} handler 
     */
    run(handler) {
        this.post("/albums", (r, h) => handler.postAlbumHandler(r, h))
        this.get("/albums/{albumId}", (r, h) => handler.getAlbumById(r, h))
        this.put("/albums/{albumId}", (r, h) => handler.editSongHandler(r, h))
        this.delete("/albums/{albumId}", (r, h) => handler.deleteAlbumHandler(r, h))
        return this.router
    }
}

module.exports = AlbumRouter