const { Pool } = require("pg")
const BaseQuery = require("../../base/query")
const { nanoid } = require("nanoid")
const InvariantError = require("../../exceptions/InvariantError")
const NotFoundError = require("../../exceptions/NotFoundError")

class CollaborationService {
    constructor() {
        this._pool = new Pool()
    }

    async verifyUserId(userId) {
        const query = new BaseQuery(
            "SELECT * FROM users WHERE id = $1",
            [
                userId
            ]
        )
        const users = await this._pool.query(query.raw())
        if (!users.rows.length) {
            throw new NotFoundError("User tidak ditemukan")
        }
    }

    async addCollaborator({ playlistId, userId }) {
        const collaborationId = nanoid()
        const query = new BaseQuery(
            "INSERT INTO collaborations VALUES ($1, $2,$3) RETURNING id",
            [
                "collaborator-" + collaborationId, playlistId, userId
            ]
        )
        const collaboration = await this._pool.query(query.raw())
        if (!collaboration.rows[0].id) {
            throw new InvariantError("Collaborator gagal ditambahkan")
        }
        return collaboration.rows[0].id
    }

    async deleteColaborator({ playlistId, userId }) {
        const query = new BaseQuery(
            "DELETE FROM collaborations WHERE playlist_id = $1 AND user_id = $2 RETURNING id",
            [
                playlistId,
                userId
            ]
        )
        const result = await this._pool.query(query.raw())
        if (!result.rows.length) {
            throw new InvariantError("Collaborator gagal dihapus")
        }
    }
}

module.exports = CollaborationService