import Hapi from "@hapi/hapi"
import AlbumsMemory from "../../services/memory/album.js";
import AlbumValidator from "../../validator/album/index.js";
export default class AlbumHandler {
    /**
     * 
     * @param {AlbumsMemory} memory
     * @param {AlbumValidator} validator
     */
    constructor(memory, validator) {
        this._memory = memory
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
    addAlbum(request, h) {
        try {
            this._validator.validate(request.payload)
            const { name, year } = request.payload
    
            const result = this._memory.addAlbum({ name, year })
            console.log(result)
            return h.response({
                status: "success",
                data: result
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
    getAlbumById(request, h) {
        const { albumId } = request.params
        try {
            const album = this._memory.getAlbumById(albumId)
            return h.response({
                status: "success",
                album: album
            }).code(201)
        } catch (err) {
            console.log(err)
            return h.response({
                status: "fail",
                message: err.message
            })
        }
    }
}