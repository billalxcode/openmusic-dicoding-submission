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
            createdAt: data.createdAt,
            updatedAt: data.updatedAt
        }
    }
}