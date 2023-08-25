import Hapi from "@hapi/hapi"
import AlbumValidator from "../../validator/album/index.js";
import AlbumService from "../../services/postgres/album.js";
import autoBind from "auto-bind";
export default class AlbumHandler {
    /**
     * 
     * @param {AlbumService} service
     * @param {AlbumValidator} validator
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
     * @returns 
     */
    async addAlbum(request, h) {
        this._validator.validate(request.payload)
        const { name, year } = request.payload
    
        const result = await this._service.addAlbum({ name, year })
        return h.response({
            status: "success",
            data: {
                "albumId": result
            }
        }).code(201)
    }

    /**
     * 
     * @param {Hapi.Request} request 
     * @param {Hapi.ResponseToolkit} h 
     */
    async getAlbumById(request, h) {
        const { albumId } = request.params
        const album = await this._service.getAlbumById({albumId})
        return h.response({
            status: "success",
            data: {
                album
            }
        }).code(200)
    }

    /**
     * 
     * @param {Hapi.Request} request 
     * @param {Hapi.ResponseToolkit} h 
     */
    async editAlbumById(request, h) {
        const { albumId } = request.params
        const { name, year } = this._validator.validate(request.payload)
        await this._service.editAlbumByid(albumId, { name, year })
        return h.response({
            status: "success",
            message: "successfully edit album with id " + albumId
        })
    }

    /**
     * 
     * @param {Hapi.Request} request 
     * @param {Hapi.ResponseToolkit} h 
     */
    async deleteAlbumById(request, h) {
        const { albumId } = request.params
        await this._service.deleteAlbumByid(albumId)
        return h.response({
            status: "success",
            message: "successfully to delete album"
        })
    }
}