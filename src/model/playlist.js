class PlaylistModel {
    mappingPlaylist(data) {
        return {
            id: data.id,
            name: data.name,
            username: data.username
        }
    }
}

module.exports = PlaylistModel