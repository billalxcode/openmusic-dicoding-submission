const { Pool } = require("pg");
const bcrypt = require("bcryptjs")
const UserModel = require("../../model/user");
const { nanoid } = require("nanoid");
const BaseQuery = require("../../base/query");
const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require("../../exceptions/NotFoundError");
const AuthenticationError = require("../../exceptions/AuthenticationError")

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

        await this.verifyNewUsername(username)
        
        const hashedPassword = bcrypt.hashSync(password, 10)

        const query = new BaseQuery(
            "INSERT INTO users VALUES ($1, $2, $3, $4, $5, $6) RETURNING id",
            [
                'user-' + nanoid(),
                username,
                hashedPassword,
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

    async getUserById(userId) {
        const query = new BaseQuery(
            "SELECT id, username, fullname FROM users WHERE id = $1",
            [
                userId
            ]
        )
        const result = await this._pool.query(query.raw())
        if (!result.rows.length) {
            throw new NotFoundError("User tidak ditemukan")
        }
        return result.rows[0]
    }

    async verifyUserCredential(username, password) {
        const query = new BaseQuery(
            "SELECT id, password FROM users WHERE username = $1",
            [
                username
            ]
        )
        const result = await this._pool.query(query.raw())
        if (!result.rows.length) {
            throw new AuthenticationError("Kredensial yang anda berikan salah")
        }

        const { id, password: hashedPassword } = result.rows[0]
        const match = await bcrypt.compareSync(password, hashedPassword)
        if (!match) {
            throw new AuthenticationError("Kredensial yang anda berikan salah")
        }
        return id
    }
}

module.exports = UserService