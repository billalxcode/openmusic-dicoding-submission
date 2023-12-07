const Hapi = require("@hapi/hapi")
const autoBind = require("auto-bind")

const PlaylistService = require("../../service/postgresql/playlist")
const UserService = require("../../service/postgresql/user")
const PlaylistValidator = require("../../validator/playlist")

class PlaylistHandler {
    /**
     * 
     * @param {PlaylistService} playlistService 
     * @param {UserService} userService 
     * @param {PlaylistValidator} validator 
     */
    constructor(playlistService, userService, validator) {
        this._playlistService = playlistService
        this._userService = userService
        this._validator = validator

        autoBind(this)
    }


    /**
     * 
     * @param {Hapi.Request} request 
     * @param {Hapi.ResponseToolkit} h 
     */
    async postPlaylistHandler(request, h) {
        this._validator.validatePlaylistPayload(request.payload)
        const { name } = request.payload
        const { id: credentialId } = request.auth.credentials
        console.log(credentialId)
        const playlistId = await this._playlistService.addPlaylist({
            name: name,
            owner: credentialId
        })
        const response = h.response({
            status: "success",
            message: "Playlist berhasil dibuat",
            data: {

                playlistId
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
    async getPlaylistsHandler(request, h) {
        const { id: credentialId } = request.auth.credentials
        const playlists = await this._playlistService.getPlaylists(credentialId)
        const response = h.response({
            status: "success",
            data: {
                playlists
            }
        })
        return response
    }
}

module.exports = PlaylistHandler