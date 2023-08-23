import BaseRouter from "../../base/router.js";
import SongHandler from "./handler.js";

export default class SongRouter extends BaseRouter {
    /**
     * 
     * @param {SongHandler} handler 
     */
    run(handler) {
        this.get("/songs", handler.getAllSongs)
        this.get("/songs/{songId}", handler.getSongById)
        this.post("/songs", handler.addSong)
        this.put("/songs/{songId}", handler.editSongById)
        return this.router
    }
}