const Hapi = require("@hapi/hapi")

class SongHandler {
    constructor(service, validator) {
        this._service = service
        this._validator = validator
    }

    /**
     * 
     * @param {Hapi.Request} request 
     * @param {Hapi.ResponseToolkit} h 
     */
    async postSongHandler(request, h) {
        
    }
}

module.exports = SongHandler