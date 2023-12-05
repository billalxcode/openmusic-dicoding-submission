require("dotenv/config")
const Hapi = require("@hapi/hapi")
const Jwt = require("@hapi/jwt")

// all plugins
const album = require("./src/api/album")
const song = require("./src/api/song")
const users = require("./src/api/users")
const auth = require("./src/api/auth")

// all services
const AlbumService = require("./src/service/postgresql/album")
const AuthService = require("./src/service/postgresql/authentication")
const SongService = require("./src/service/postgresql/song")
const UserService = require("./src/service/postgresql/user")

// all validators
const AlbumValidator = require("./src/validator/album")
const AuthValidator = require("./src/validator/authentication")
const SongValidator = require("./src/validator/song")
const UserValidator = require("./src/validator/user")

// exceptions
const ClientError = require("./src/exceptions/ClientError")

// tokenize
const TokenManager = require("./src/tokenize/TokenManager")

class App {
    constructor() {
        console.clear()
        
        this.server = Hapi.server({
            host: process.env.HOST ?? "localhost",
            port: process.env.PORT ?? 3000,
            routes: {
                cors: {
                    origin: ["*"]
                }
            }
        })
    }

    async register_plugins() {
        this.plugins = [
            {
                plugin: Jwt
            },
            {
                plugin: album,
                options: {
                    service: new AlbumService(),
                    validator: new AlbumValidator()
                }
            },
            {
                plugin: song,
                options: {
                    service: new SongService(),
                    validator: new SongValidator()
                }
            },
            {
                plugin: users,
                options: {
                    service: new UserService(),
                    validator: new UserValidator()
                }
            },
            {
                plugin: auth,
                options: {
                    authService: new AuthService(),
                    userService: new UserService(),
                    tokenManager: new TokenManager(),
                    validator: new AuthValidator()
                }
            }
        ]

        this.plugins.forEach((plugin) => {
            this.server.register(plugin)
        })
    }

    async register_strategy() {
        this.server.auth.strategy("openmusic_jwt", "jwt", {
            keys: process.env.ACCESS_TOKEN_KEY,
            verify: {
                aud: false,
                iss: false,
                sub: false,
                maxAgeSec: process.env.ACCESS_TOKEN_AGE
            },
            validate: (artifacts) => ({
                isValid: true,
                credentials: {
                    id: artifacts.decoded.payload.id
                }
            })
        })
    }

    async start() {
        await this.register_plugins()
        await this.register_strategy()

        this.server.ext("onPreResponse", (request, h) => {
            const { response } = request

            if (response instanceof Error) {
                if (response instanceof ClientError) {
                    const newResponse = h.response({
                        status: "fail",
                        message: response.message
                    })
                    newResponse.code(response.statusCode)
                    return newResponse
                }

                if (!response.isServer) {
                    return h.continue
                }

                const newResponse = h.response({
                    status: "error",
                    message: "terjadi kegagalan pada server kami",
                    stack: response.stack
                })
                newResponse.code(500)
                return newResponse
            }

            return h.continue
        })

        console.log(`running server on ${this.server.info.uri}`)
        await this.server.start()
    }
}

const app = new App()
app.start()
    