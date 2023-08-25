import Postgress from "pg";
import SongModel from "../../model/song.js";
import { nanoid } from "nanoid";
import BaseQuery from "../../base/query.js";
import InvariantError from "../../exceptions/InvariantError.js";
import NotFoundError from "../../exceptions/NotFoundError.js";
const { Pool } = Postgress

export default class SongService {
    constructor() {
        this._pool = new Pool()

        this._model = new SongModel()
    }

    async addSong({ title, year, genre, performer, duration, albumId }) {
        const songId = nanoid(16)
        const query = new BaseQuery(
            "INSERT INTO songs VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id",
            [
                "song-" + songId,
                title,
                year,
                genre,
                performer,
                duration,
                albumId
            ]
        )
        
        const result = await this._pool.query(query.raw())
        if (!result.rows[0].id) {
            throw new InvariantError("Song gagal ditambahkan")
        }
        return result.rows[0].id
    }

    async getSongs(request_query) {
        const { title = "", performer = "" } = request_query

        const query = new BaseQuery(
            "SELECT id, title, performer FROM songs WHERE title ILIKE $1 AND performer ILIKE $2;",
            [
                `%${title}%`,
                `%${performer}%`
            ]
        )
        
        const result = await this._pool.query(query.raw())
        console.log(result.rows)
        if (!result.rows.length) {
            throw new InvariantError("Lagu kosong")
        }
        return result.rows.map(this._model.mapping)
    }

    async getSongById(songId) {
        const query = new BaseQuery(
            "SELECT * FROM songs WHERE id = $1",
            [songId]
        )

        const result = await this._pool.query(query.raw())

        if (!result.rows.length) {
            throw new NotFoundError("Gagal mengambil lagu, id tidak ditemukan")
        }
        return result.rows.map(this._model.mapping)[0]
    }

    async editSongById(songId, { title, year, performer, genre, duration, albumId }) {
            const updatedAt = new Date().toISOString()

            const query = new BaseQuery(
                "UPDATE songs SET title = $1, year = $2, performer = $3, genre = $4, duration = $5, album_id = $6 WHERE id = $7 RETURNING id",
                [
                    title,
                    year,
                    performer,
                    genre,
                    duration,
                    albumId,
                    songId
                ]
            )
            const result = await this._pool.query(query.raw())
            if (!result.rows.length) {
                throw new NotFoundError("Gagal mengubah lagu, id tidak ditemukan")
            }
            return true
    }

    async deleteSongById(songId) {
        const query = new BaseQuery(
            "DELETE FROM songs WHERE id = $1 RETURNING id",
            [songId]
        )
        const result = await this._pool.query(query.raw())
        if (!result.rows.length) {
            throw new NotFoundError("Failed delete song, id not found")
        }
        return true
    }
}