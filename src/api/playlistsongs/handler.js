const Hapi = require("@hapi/hapi")
const autoBind = require("auto-bind")

class PlaylistSongHandler {
    /**
     * 
     * @param {*} playlistSongService 
     * @param {*} songService 
     * @param {*} validator 
     */
    constructor(playlistSongService, songService, validator) {
        this._playlistSongService = playlistSongService
        this._songService = songService
        this._validator = validator

        autoBind(this)
    }

    async postSongHandler(request, h) {
        this._validator
    }
}

module.exports = PlaylistSongHandler