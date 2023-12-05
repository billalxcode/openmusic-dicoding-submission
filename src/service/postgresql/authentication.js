const { Pool } = require("pg")
const BaseQuery = require("../../base/query")
const InvariantError = require("../../exceptions/InvariantError")

class AuthenticationService {
    constructor() {
        this._pool = new Pool()
    }

    async addRefreshToken(token) {
        const query = new BaseQuery(
            "INSERT INTO authentications VALUES ($1)",
            [
                token
            ]
        )
        await this._pool.query(query.raw())
    }

    async verifyRefreshToken(token) {
        const query = new BaseQuery(
            "SELECT token FROM authentications WHERE token = $1",
            [
                token
            ]
        )
        const result = await this._pool.query(query.raw())
        if (!result.rows.length) {
            throw new InvariantError("Refresh token tidak valid")
        }
    }

    async deleteRefreshToken(token) {
        const query = new BaseQuery(
            "DELETE FROM authentications WHERE token = $1",
            [
                token
            ]
        )
        await this._pool.query(query.raw())
    }
}

module.exports = AuthenticationService