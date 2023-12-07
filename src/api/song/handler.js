const Hapi = require("@hapi/hapi")
const SongValidator = require("../../validator/song")
const SongService = require("../../service/postgresql/song")
const BaseQuery = require("../../base/query")
const autoBind = require("auto-bind")

class SongHandler {
    /**
     * 
     * @param {SongService} service 
     * @param {SongValidator} validator 
     */
    constructor(service, validator) {
        this._service = service
        this._validator = validator

        autoBind(this)
    }

    /**
     * 
     * @param {Hapi.Request} request 
     * @param {Hapi.ResponseToolkit} h 
     */
    async postSongHandler(request, h) {
        this._validator.validateSongPayload(request.payload)
        const { title, year, performer, genre, duration, albumId } = request.payload

        const songId = await this._service.addSong({ title, year, performer, genre, duration, albumId })
        
        const response = h.response({
            status: "success",
            message: "song berhasil ditambahkan",
            data: {
                songId
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
    async getSongsHandler(request, h) {
        const { title, performer } = request.query

        const songs = await this._service.getSongs(title, performer)
        const response = h.response({
            status: "success",
            data: {
                songs
            }
        })
        return response
    }

    /**
     * 
     * @param {Hapi.request} request 
     * @param {Hapi.ResponseToolkit} h 
     */
    async getSongById(request, h) {
        const { songId = "" } = request.params
        const song = await this._service.getSongById(songId)

        const response = h.response({
            status: "success",
            data: {
                song
            }
        })

        return response
    }

    /**
     * 
     * @param {Hapi.Request} request 
     * @param {Hapi.ResponseToolkit} h 
     */
    async editSongHandler(request, h) {
        const validatedSongPayload = this._validator.validateSongPayload(request.payload)
        const { songId = "" } = request.params
        
        await this._service.editSongById(songId, validatedSongPayload)

        const response = h.response({
            status: "success",
            message: "song berhasil diperbaharui"
        })
        return response
    }

    /**
     * 
     * @param {Hapi.Request} request 
     * @param {Hapi.ResponseToolkit} h 
     */
    async deleteSongHandler(request, h) {
        const { songId = "" } = request.params
        await this._service.deleteSongById(songId)

        const response = h.response({
            status: "success",
            message: "song berhasil dihapus"
        })
        return response
    }
}

module.exports = SongHandler