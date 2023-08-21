import { nanoid } from "nanoid";
import { Pool } from "pg";
import InvariantError from "../../exceptions/InvariantError.js";
import NotFoundError from "../../exceptions/NotFoundError.js";

export default class AlbumService {
    constructor() {
        this._pool = new Pool()
        this._model = new AlbumModel()
    }

    async addAlbum({ name, year }) {
        const albumId = nanoid(16)
        const createdAt = new Date().toISOString()
        const updatedAt = createdAt
        const query = {
            text: "INSERT INTO albums VALUES ($1, $2, $3, $4, $5) RETURNING id",
            values: [
                "album-" + albumId,
                name,
                year,
                createdAt,
                updatedAt
            ]
        }

        const result = await this._pool.query(query)
        if (!result.rows[0].id) {
            throw new InvariantError("Album gagal ditambahkan")
        }
        return result.rows[0].id
    }

    async getAlbumById({ albumId }) {
        const result = await this._pool.query({
            text: "SELECT * FROM albums WHERE id = $1",
            values: [albumId]
        })
        if (!result.rows[0].id) {
            throw new NotFoundError("Albums not found")
        }

        return result.rows.map(this._model.mapping)[0]
    }
}