import BaseRouter from "../../base/router.js"
import AlbumHandler from "./handler.js"

export default class AlbumRouter extends BaseRouter {
    /**
     * 
     * @param {AlbumHandler} handler 
     * @returns 
     */
    run(handler) {
        this.get("/albums/{albumId}", handler.getAlbumById)
        this.post("/albums", handler.addAlbum)
        this.put("/albums/{albumId}", handler.editAlbumById)
        this.delete("/albums/{albumId}", handler.deleteAlbumById)
        return this.router
    }
}