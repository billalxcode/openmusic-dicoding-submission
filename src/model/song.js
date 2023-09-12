class SongModel {
    mappingSong(data) {
        return {
            id: data.id,
            title: data.title,
            year: data.year,
            performer: data.performer,
            genre: data.genre,
            duration: data.duration,
            albumId: data.album_id,
            createdAt: data.created_at,
            updatedAt: data.updated_at
        }
    }
}

module.exports = SongModel