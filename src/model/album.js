export default class AlbumModel {
    constructor() {
        this.name = ""
        this.year = 0
    }

    setName(name) {
        this.name = name
        return this
    }

    setYear(year) {
        this.year = year
        return this
    }

    getName() {
        return this.name
    }

    getYear() {
        return this.year
    }

    mapping(data) {
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
     * 
     * @param {Array} albums 
     * @param {Array} songs 
     */
    mappingAlbumAndSong(albums, songs) {
        let map = albums.map(this.mapping)[0]
        map["songs"] = songs.map(this.mappingSong)
        return map
    }
}