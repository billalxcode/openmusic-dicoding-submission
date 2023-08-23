import { nanoid } from "nanoid";
import Postgress from "pg";
import InvariantError from "../../exceptions/InvariantError.js";
import NotFoundError from "../../exceptions/NotFoundError.js";
import AlbumModel from "../../model/album.js";
import BaseQuery from "../../base/query.js";
const { Pool } = Postgress

export default class AlbumService {
    constructor() {
        this._pool = new Pool()
        
        this._model = new AlbumModel()
    }

    async addAlbum({ name, year }) {
        const albumId = nanoid(16)
        const query = {
            text: "INSERT INTO albums VALUES ($1, $2, $3) RETURNING id",
            values: [
                "album-" + albumId,
                name,
                year
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
        if (!result.rows.length) {
            throw new NotFoundError("Albums not found")
        }

        return result.rows.map(this._model.mapping)[0]
    }

    async editAlbumByid(albumId, { name, year }) {
        const updatedAt = new Date().toISOString()
        const query = {
            text: 'UPDATE albums SET name = $1, year = $2 WHERE id = $3 RETURNING id',
            values: [name, year, albumId],
        };
        const result = await this._pool.query(query)
        if (!result.rows.length) {
            throw new NotFoundError("Failed update album, id not found")
        }
        return true
    }

    async deleteAlbumByid(albumId) {
        const query = new BaseQuery(
            "DELETE FROM albums WHERE id = $1 RETURNING id",
            [albumId]
        )
        const result = await this._pool.query(query.raw())
        if (!result.rows.length) {
            throw new NotFoundError("Failed delete album, id not found")
        }
        return true
    }
}