const { Pool } = require("pg");
const UserModel = require("../../model/user");
const { nanoid } = require("nanoid");
const BaseQuery = require("../../base/query");
const InvariantError = require("../../exceptions/InvariantError");

class UserService {
    constructor() {
        this._pool = new Pool()
        this._model = new UserModel()
    }

    async verifyNewUsername(username) {
        const query = new BaseQuery(
            "SELECT username FROM users WHERE username = $1",
            [
                username
            ]
        )
        const result = await this._pool.query(query.raw())
        if (result.rows.length > 0) {
            throw new InvariantError("Gagal menambahkan user. Username sudah digunakan")
        }
    }
    
    async addUser({ username, password, fullname }) {
        const created_at = new Date().toISOString()

        this.verifyNewUsername(username)
        
        const query = new BaseQuery(
            "INSERT INTO users VALUES ($1, $2, $3, $4, $5, $6) RETURNING id",
            [
                'user-' + nanoid(),
                username,
                password,
                fullname,
                created_at,
                created_at
            ]
        )
        const result = await this._pool.query(query.raw())

        if (!result.rows[0].id) {
            throw new InvariantError("user gagal ditambahkan")
        }

        return result.rows[0].id
    }
}

module.exports = UserService