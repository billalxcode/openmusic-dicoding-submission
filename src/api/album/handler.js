import Hapi from "@hapi/hapi"
import AlbumValidator from "../../validator/album/index.js";
import AlbumService from "../../services/postgres/album.js";
export default class AlbumHandler {
    /**
     * 
     * @param {AlbumService} service
     * @param {AlbumValidator} validator
     */
    constructor(service, validator) {
        this._service = service
        this._validator = validator

        this.addAlbum = this.addAlbum.bind(this)
        this.getAlbumById = this.getAlbumById.bind(this)
    }
    
    /**
     * 
     * @param {Hapi.Request} request 
     * @param {Hapi.ResponseToolkit} h 
     * @returns 
     */
    async addAlbum(request, h) {
        try {
            this._validator.validate(request.payload)
            const { name, year } = request.payload
    
            const result = await this._service.addAlbum({ name, year })
            return h.response({
                status: "success",
                data: {
                    "albumId": result
                }
            }).code(201)
        } catch (error) {
            return h.response({
                status: "fail",
                message: error.message
            }).code(400)
        }
    }

    /**
     * 
     * @param {Hapi.Request} request 
     * @param {Hapi.ResponseToolkit} h 
     */
    async getAlbumById(request, h) {
        const { albumId } = request.params
        try {
            const album = await this._service.getAlbumById({albumId})
            return h.response({
                status: "success",
                data: {
                    album
                }
            }).code(200)
        } catch (err) {
            return h.response({
                status: "fail",
                message: err.message
            })
        }
    }
}