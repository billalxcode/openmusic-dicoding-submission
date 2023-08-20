import BaseRouter from "../../base/router.js"

export default class AlbumRouter extends BaseRouter {
    run(handler) {
        this.get("/albums/{albumId}", handler.getAlbumById)
        this.post("/albums", handler.addAlbum)
        return this.router
    }
}