import { nanoid } from "nanoid"

export default class AlbumsMemory {
    constructor() {
        this._albums = []
    }

    getAlbums() {
        return this._albums
    }

    getAlbumById(id) {
        const album = this._albums.filter((v) => {
            return v.albumId === id
        })[0]

        if (!album) {
            throw new Error("album not found")
        }
        return album
    }

    addAlbum({ name, year }) {
        const albumId = nanoid(16)
        const createdAt = new Date().toISOString()
        const updatedAt = createdAt

        const data = {
            albumId,
            name,
            year,
            createdAt,
            updatedAt
        }
        return { albumId }
    }
}