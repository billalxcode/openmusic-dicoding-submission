const { Pool } = require("pg")
const { nanoid } = require("nanoid")
const BaseQuery = require("../../base/query")
const InvariantError = require("../../exceptions/InvariantError")
const SongModel = require("../../model/song")
const NotFoundError = require("../../exceptions/NotFoundError")

class SongService {
    constructor() {
        this._pool = new Pool()
        this._model = new SongModel()
    }

    async verifySongId(songId) {
        const query = new BaseQuery(
            "SELECT * FROM songs WHERE id = $1",
            [
                songId
            ]
        )
        const result = await this._pool.query(query.raw())
        if (!result.rows.length) {
            throw new NotFoundError("Song tidak ditemukan")
        }
    }

    async addSong({ title, year, performer, genre, duration, albumId }) {
        const created_at = new Date().toISOString()

        const query = new BaseQuery(
            "INSERT INTO songs VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id",
            [
                "song-" + nanoid(),
                title,
                year,
                performer,
                genre,
                duration,
                albumId,
                created_at,
                created_at
            ]
        )
        const result = await this._pool.query(query.raw())

        if (!result.rows[0].id) {
            throw new InvariantError("song gagal ditambahkan")
        }

        return result.rows[0].id
    }

    async getSongs(title = "", performer = "" ) {
        const query = new BaseQuery(
            "SELECT id, title, performer FROM songs WHERE title ILIKE $1 AND performer ILIKE $2",
            [
                `%${title}%`, `%${performer}%`
            ]
        )
        const results = await this._pool.query(query.raw())
        return results.rows.map(this._model.mappingSong)
    }

    async getSongById(songId) {
        const query = new BaseQuery(
            "SELECT * FROM songs WHERE id = $1",
            [
                songId
            ]
        )

        const results = await this._pool.query(query.raw())
        if (!results.rows.length) {
            throw new NotFoundError("song tidak ditemukan")
        }
        return results.rows.map(this._model.mappingSong)[0]
    }

    async editSongById(songId, {title, year, performer, genre, duration, albumId }) {
        const updatedAt = new Date().toISOString()

        const query = new BaseQuery(
            "UPDATE songs SET title = $1, year = $2, performer = $3, genre = $4, duration = $5, album_id = $6, updated_at = $7 WHERE id = $8 RETURNING id",
            [
                title, year, performer, genre, duration, albumId, updatedAt, songId
            ]
        )
        const results = await this._pool.query(query.raw())
        if (!results.rows.length) {
            throw new NotFoundError("gagal memperbaharui song, id tidak ditemukan")
        } 
        return results.rows
    }

    async deleteSongById(songId) {
        const query = new BaseQuery(
            "DELETE FROM songs WHERE id= $1 RETURNING id",
            [
                songId
            ]
        )
        const result = await this._pool.query(query.raw())
        if (!result.rows.length) {
            throw new NotFoundError("song gagal dihapus, id tidak ditemukan")
        }
    }
}

module.exports = SongService