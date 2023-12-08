const Hapi = require("@hapi/hapi")
const autoBind = require("auto-bind")
const PlaylistSongService = require("../../service/postgresql/playlistsongs")
const SongService = require("../../service/postgresql/song")
const PlaylistSongValidator = require("../../validator/playlistsongs")
const PlaylistService = require("../../service/postgresql/playlist")

class PlaylistSongHandler {
    /**
     * 
     * @param {PlaylistSongService} playlistSongService 
     * @param {SongService} songService 
     * @param {PlaylistService} playlistService
     * @param {PlaylistSongValidator} validator 
     */
    constructor(playlistSongService, songService, playlistService, validator) {
        this._playlistSongService = playlistSongService
        this._songService = songService
        this._playlistService = playlistService
        this._validator = validator

        autoBind(this)
    }

    /**
     * 
     * @param {Hapi.Request} request 
     * @param {Hapi.ResponseToolkit} h 
     */
    async postSongHandler(request, h) {
        this._validator.validatePayload(request.payload)

        const { songId } = request.payload
        const { playlistId } = request.params
        const { id: credentialId } = request.auth.credentials

        await this._playlistService.verifyPlaylistAccess(playlistId, credentialId)
        
        const playlistSongId = await this._playlistSongService.addSongPlaylist({ playlistId, songId })
        const response = h.response({
            status: "success",
            message: "berhasil menambahkan lagu ke playlist",
            data: {
                playlistSongId
            }
        })
        response.code(201)
        return response
    }

    /**
     * 
     * @param {Hapi.Request} request 
     * @param {Hapi.ResponseToolkit} h 
     */
    async getAllSongs(request, h) {
        const { playlistId } = request.params
        const { id: credentialId } = request.auth.credentials
        
        await this._playlistService.verifyPlaylistAccess(playlistId, credentialId)
        const songs = await this._playlistSongService.getAllSongs(playlistId)
        const playlist = await this._playlistService.getPlaylistById(playlistId, songs)
        
        const response = h.response({
            status: "success",
            message: "berhasil mengambil data lagu",
            data: {
                playlist
            }
        })
        return response
    }
}

module.exports = PlaylistSongHandler