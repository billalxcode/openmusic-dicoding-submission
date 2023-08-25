export default class SongModel {
    constructor() {
        this.data = {}
    }

    setData(data) {
        if (data instanceof Object) {
            this.data = data
        }
    }

    mapping(data) {
        let tdata = {
            id: data.id,
            title: data.title,
            year: data.year,
            genre: data.genre,
            performer: data.performer,
            duration: data.duration,
            albumId: data.album_id
        }

        if ("createdAt" in Object.keys(data)) {
            tdata["createdAt"] = data.created_at
        }
        if ("updatedAt" in Object.keys(data)) {
            tdata["updatedAt"] = data.updated_at
        }
        
        return tdata
    }
}