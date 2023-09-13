const { nanoid } = require("nanoid")
const { Pool } = require('pg')
const BaseQuery = require("../../base/query")
const InvariantError = require("../../exceptions/InvariantError")
const NotFoundError = require("../../exceptions/NotFoundError")
const AlbumModel = require("../../model/album")

class AlbumService {
    constructor() {
        this._pool = new Pool()
        this._model = new AlbumModel()
    }

    async addAlbum({ name, year }) {
        const albumId = nanoid(16)
        const created_at = new Date().toISOString()

        const query = new BaseQuery(
            'INSERT INTO albums VALUES ($1, $2, $3, $4, $5) RETURNING id',
            [
                "album-" + albumId,
                name,
                year,
                created_at, 
                created_at
            ]
        )

        const result = await this._pool.query(query.raw())
        if (!result.rows[0].id) {
            throw new InvariantError("album gagal ditambahkan")
        }

        return result.rows[0].id
    }

    async getAlbumById(albumId) {
        const query = new BaseQuery(
            'SELECT * FROM albums WHERE id = $1',
            [
                albumId
            ]
        )

        const resultAlbum = await this._pool.query(query)
        if (!resultAlbum.rows.length) {
            throw new NotFoundError("album tidak ditemukan")
        }

        const querySong = new BaseQuery(
            'SELECT songs.id, songs.title, songs.performer FROM albums JOIN songs ON albums.id = songs.album_id WHERE albums.id = $1',
            [
                albumId
            ]
        )
        const reusltSong = await this._pool.query(querySong)
        return this._model.mappingAlbumAndSong(resultAlbum.rows, reusltSong.rows)
    }

    async editAlbumById(albumId, { name, year }) {
        const updatedAt = new Date().toISOString()

        const query = new BaseQuery(
            "UPDATE albums SET name = $1, year = $2 WHERE id = $3 RETURNING id",
            [
                name, year, albumId
            ]
        )
        const results = await this._pool.query(query.raw())
        if (!results.rows.length) {
            throw new NotFoundError("gagal memperbaharui album, id tidak ditemukan")
        }
        return results.rows
    }

    async deleteAlbumById(albumId) {
        const query = new BaseQuery(
            "DELETE FROM albums WHERE id = $1 RETURNING id",
            [
                albumId
            ]
        )
        const result = await this._pool.query(query.raw())
        if (!result.rows.length) {
            throw new NotFoundError("album gagal dihapus, id tidak ditemukan")
        }
    }
}

module.exports = AlbumService