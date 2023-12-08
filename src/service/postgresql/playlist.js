const { Pool } = require("pg")
const { nanoid } = require("nanoid")
const BaseQuery = require("../../base/query")
const InvariantError = require("../../exceptions/InvariantError")
const PlaylistModel = require("../../model/playlist")
const NotFoundError = require("../../exceptions/NotFoundError")
const AuthorizationError = require("../../exceptions/AuthorizationError")

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

    async verifyPlaylistOwner(playlistId, credentialId) {
        const query = new BaseQuery(
            "SELECT * FROM playlists WHERE id = $1",
            [
                playlistId
            ]
        )
        const result = await this._pool.query(query.raw())
        if (!result.rows.length) {
            throw new NotFoundError("Playlist tidak ditemukan")
        }
        const playlist = result.rows[0]
        if (playlist.owner !== credentialId) {
            throw new AuthorizationError("Kamu tidak berhak mengakses resource ini.")
        }
    }

    async verifyPlaylistAccess(playlistId, credentialId) {
        try {
            await this.verifyPlaylistOwner(playlistId, credentialId)
        } catch (error) {
            throw error
            // if (error instanceof NotFoundError) {
            //     throw error
            // }
        }
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