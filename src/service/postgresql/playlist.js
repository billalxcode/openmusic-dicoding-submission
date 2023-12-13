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

    async verifyPlaylistCollaborator(playlistId, userId) {
        const query = new BaseQuery(
            "SELECT * FROM collaborations WHERE playlist_id = $1 AND user_id = $2",
            [
                playlistId, userId
            ]
        )
        const result = await this._pool.query(query.raw())
        if (!result.rows.length) {
            throw new NotFoundError("Kolaborator gagal diverifikasi")
        }
    }

    async verifyPlaylistAccess(playlistId, credentialId) {
        try {
            await this.verifyPlaylistOwner(playlistId, credentialId)
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw error
            }
            try {
                await this.verifyPlaylistCollaborator(playlistId, credentialId)
            } catch {
                throw error
            }
        }
    }

    async getPlaylists(owner) {
        const query = new BaseQuery(
            "SELECT playlists.*, users.username FROM playlists LEFT JOIN collaborations ON collaborations.playlist_id = playlists.id LEFT JOIN users ON playlists.owner = users.id WHERE playlists.owner = $1 OR collaborations.user_id = $1 GROUP BY playlists.id, users.username",
            [
                owner
            ]
        )
        const playlists = await this._pool.query(query.raw())
        return playlists.rows.map(this._model.mappingPlaylist)
    }

    async getPlaylistById(credentialId, songs = []) {
        const query = new BaseQuery(
            "SELECT playlists.*, users.username FROM playlists LEFT JOIN users ON users.id = playlists.owner WHERE playlists.id = $1",
            [
                credentialId
            ]
        )
        const playlists = await this._pool.query(query.raw())
        return playlists.rows.map((data) => {
            return {
                id: data.id,
                name: data.name,
                username: data.username,
                songs: songs
            }
        })[0]
    }

    async deletePlaylistById(playlistId) {
        const query = new BaseQuery(
            "DELETE FROM playlists WHERE id = $1 RETURNING id",
            [
                playlistId
            ]
        )
        const result = await this._pool.query(query.raw())
        if (!result.rows.length) {
            throw new InvariantError("Playlist gagal dihapus")
        }
    }

    async getPlaylistActivities(playlistId) {
        const query = new BaseQuery(
            "SELECT username, title, action, time FROM playlist_song_activities LEFT JOIN songs ON playlist_song_activities.song_id = songs.id LEFT JOIN users ON playlist_song_activities.user_id = users.id WHERE playlist_id = $1",
            [
                playlistId
            ]
        )
        const results = await this._pool.query(query.raw())
        return results.rows.map((d) => {
            return {
                username: d.username,
                title: d.title,
                action: d.action,
                time: d.time
            }
        })
    }
}

module.exports = PlaylistService