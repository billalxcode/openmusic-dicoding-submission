const { Pool } = require("pg")
const { nanoid } = require("nanoid")
const BaseQuery = require("../../base/query")
const InvariantError = require("../../exceptions/InvariantError")

class SongService {
    constructor() {
        this._pool = new Pool()
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
}