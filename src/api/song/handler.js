import Hapi from "@hapi/hapi"
import SongService from "../../services/postgres/song.js"
import SongValidator from "../../validator/song/index.js"
import autoBind from "auto-bind"

export default class SongHandler {
    /**
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
     * 
     * @returns
     */
    async addSong(request, h) {
        const payloadValidated = this._validator.validate(request.payload)
        const result = await this._service.addSong(payloadValidated)
        return h.response({
            status: "success",
            data: {
                "songId": result
            }
        }).code(201)
    }

    /**
     * 
     * @param {Hapi.Request} request 
     * @param {Hapi.ResponseToolkit} h 
     */
    async getAllSongs(request, h) {
        const query = this._validator.validate(request.query, "query")
        
        const songs = await this._service.getSongs(query)

        return h.response({
            status: "success",
            data: {
                songs
            }
        })
    }

    /**
     * 
     * @param {Hapi.Request} request 
     * @param {Hapi.ResponseToolkit} h 
     */
    async getSongById(request, h) {
        const { songId } = request.params

        const song = await this._service.getSongById(songId)
        return h.response({
            status: "success",
            data: { song }
        })
    }

    /**
     * 
     * @param {Hapi.Request} request 
     * @param {Hapi.ResponseToolkit} h 
     */
    async editSongById(request, h) {
        const payloadValidated = this._validator.validate(request.payload)
        const { songId } = request.params

        await this._service.editSongById(songId, payloadValidated)
        return h.response({
            status: "success",
            message: "successfully to update song"
        })
    }

    /**
     * 
     * @param {Hapi.Request} request 
     * @param {Hapi.ResponseToolkit} h 
     */
    async deleteSongById(request, h) {
        const { songId } = request.params

        await this._service.deleteSongById(songId)
        return h.response({
            status: "success",
            message: "song has been deleted"
        })
    }
}