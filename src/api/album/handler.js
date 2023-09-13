const Hapi = require("@hapi/hapi")
const AlbumService = require("../../service/postgresql/album")
const AlbumValidator = require("../../validator/album")

class AlbumHandler {
    /**
     * 
     * @param {AlbumService} service 
     * @param {AlbumValidator} validator 
     */
    constructor(service, validator) {
        this._service = service
        this._validator = validator
    }

    /**
     * 
     * @param {Hapi.Request} request 
     * @param {Hapi.ResponseToolkit} h 
     * @returns
     */
    async postAlbumHandler(request, h) {
        this._validator.validateAlbumPayload(request.payload)
        const { name, year } = request.payload

        const albumId = await this._service.addAlbum({ name, year })

        const response = h.response({
            status: "success",
            message: "album berhasil ditambahkan",
            data: {
                albumId
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
    async getAlbumById(request, h) {
        const { albumId } = request.params
        const album = await this._service.getAlbumById(albumId)

        return h.response({ 
            status: "success",
            data: {
                album
            }
        })
    }

    /**
     * 
     * @param {Hapi.Request} request 
     * @param {Hapi.ResponseToolkit} h 
     */
    async editSongHandler(request, h) {
        const validatedAlbumPayload = this._validator.validateAlbumPayload(request.payload)
        const { albumId = "" } = request.params

        await this._service.editAlbumById(albumId, validatedAlbumPayload)

        const response = h.response({
            status: "success",
            message: "album berhasil diperbaharui"
        })
        return response
    }

    /**
     * 
     * @param {Hapi.Request} request 
     * @param {Hapi.ResponseToolkit} h 
     * @returns 
     */
    async deleteAlbumHandler(request, h) {
        const { albumId = "" } = request.params

        await this._service.deleteAlbumById(albumId)

        const response = h.response({
            status: "success",
            message: "album berhasil dihapus"
        })
        return response
    }
}

module.exports = AlbumHandler