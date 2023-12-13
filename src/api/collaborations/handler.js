const Hapi = require("@hapi/hapi")
const CollaborationService = require("../../service/postgresql/collaboration")
const PlaylistService = require("../../service/postgresql/playlist")
const CollaborationValidator = require("../../validator/collaboration")

class CollaborationHandler {
    /**
     * 
     * @param {CollaborationService} collaborationService 
     * @param {PlaylistService} playlistService 
     * @param {CollaborationValidator} validator 
     */
    constructor(collaborationService, playlistService, validator) {
        this._collaborationService = collaborationService
        this._playlistService = playlistService
        this._validator = validator
    }

    /**
     * 
     * @param {Hapi.Request} request 
     * @param {Hapi.ResponseToolkit} h 
     */
    async postCollabrationHandler(request, h) {
        this._validator.validateCollaborationPayload(request.payload)
        const { playlistId, userId } = request.payload
        const { id: credentialId } = request.auth.credentials

        await this._collaborationService.verifyUserId(userId)
        await this._playlistService.verifyPlaylistOwner(playlistId, credentialId)
        const collaborationId = await this._collaborationService.addCollaborator({ playlistId, userId })

        const response = h.response({
            status: "success",
            message: "Collaborator berhasil ditambahkan",
            data: {
                collaborationId
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
    async deleteCollaborationHandler(request, h) {
        this._validator.validateCollaborationPayload(request.payload)
        const { playlistId, userId } = request.payload
        const { id: credentialId } = request.auth.credentials

        await this._playlistService.verifyPlaylistOwner(playlistId, credentialId)
        await this._collaborationService.deleteColaborator({ playlistId, userId})
        
        const response = h.response({
            status: "success",
            message: "Collaborator berhasil dihapus"
        })
        return response
    }
}

module.exports = CollaborationHandler