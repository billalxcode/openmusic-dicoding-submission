const { Pool } = require("pg")
const { nanoid } = require("nanoid")
const BaseQuery = require("../../base/query")
const InvariantError = require("../../exceptions/InvariantError")
const PlaylistModel = require("../../model/playlist")

class PlaylistService {
    constructor() {
        this._pool = new Pool()
        this._model = new PlaylistModel()
    }

    async addPlaylist({ name, owner }) {
        const playlistId = nanoid(16)
        const created_at = new Date().toISOString()
        
        const query = new BaseQuery(
            "INSERT INTO playlists VALUES ($1, $2, $3, $4, $5) RETURNING id",
            [
                "playlist-" + playlistId,
                name,
                owner,
                created_at,
                created_at
            ]
        )
        
        const result = await this._pool.query(query.raw())
        if (!result.rows[0].id) {
            throw new InvariantError("Playlist gagal ditambahkan")
        }

        return result.rows[0].id
    }

    async getPlaylists(owner) {
        const query = new BaseQuery(
            "SELECT playlists.id, playlists.name, users.username FROM playlists LEFT JOIN users ON playlists.owner = users.id WHERE playlists.owner = $1",
            [
                owner
            ]
        )
        const playlists = await this._pool.query(query.raw())
        return playlists.rows.map(this._model.mappingPlaylist)
    }
}

module.exports = PlaylistService