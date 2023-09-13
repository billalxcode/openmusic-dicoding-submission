class AlbumModel {
    mappingAlbum(data) {
        return {
            id: data.id,
            name: data.name,
            year: data.year,
            createdAt: data.created_at,
            updatedAt: data.updated_at
        }
    }

    mappingSong(data) {
        return {
            id: data.id,
            title: data.title,
            performer: data.performer
        }
    }

    /**
     * @param {Array} albums
     * @param {Array} songs
     */
    mappingAlbumAndSong(albums, songs) {
        let results = albums.map(this.mappingAlbum)[0]
        
        results["songs"] = songs.map(this.mappingSong)

        return results
    }
}

module.exports = AlbumModel