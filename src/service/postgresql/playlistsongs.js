const { Pool } = require("pg")
const { nanoid } = require("nanoid")
const BaseQuery = require("../../base/query")
const InvariantError = require("../../exceptions/InvariantError")
const NotFoundError = require("../../exceptions/NotFoundError")
const SongService = require("./song")

class PlaylistSongService {
    constructor() {
        this._pool = new Pool()
        this.songService = new SongService()
    }

    async addSongPlaylist({ playlistId, songId }) {
        const created_at = new Date().toISOString()
        const playlistSongId = nanoid(16)
        
        await this.songService.verifySongId(songId)
        
        const query = new BaseQuery(
            "INSERT INTO playlistsongs VALUES ($1, $2, $3, $4, $5) RETURNING id",
            [
                "playlist-song-" + playlistSongId,
                playlistId,
                songId,
                created_at,
                created_at
            ]
        )
        const result = await this._pool.query(query.raw())
        if (!result.rows[0].id) {
            throw new InvariantError("Gagal menambahkan lagu ke playlist")
        }
        return result.rows[0]
    }

    async getAllSongs(playlistId) {
        const query = new BaseQuery(
            "SELECT playlistsongs.*, songs.title, songs.performer FROM playlistsongs LEFT JOIN songs ON songs.id = playlistsongs.song_id WHERE playlistsongs.playlist_id = $1",
            [
                playlistId
            ]
        )
        const result = await this._pool.query(query.raw())
        if (!result.rows.length) {
            throw new NotFoundError("Playlist tidak ditemukan")
        }
        return result.rows.map((data) => {
            return {
                id: data.song_id,
                title: data.title,
                performer: data.performer
            }
        })
    }
}

module.exports = PlaylistSongService