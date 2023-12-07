const { Pool } = require("pg")
const BaseQuery = require("../../base/query")

class PlaylistSongService {
    constructor() {
        this._pool = new Pool()
    }

    async addSongPlaylist({ playlistId, songId }) {
        const query = new BaseQuery(
            "INSERT INTO playlistsongs VALUES ($1, $2, $3"
        )
    }
}

module.exports = PlaylistSongService