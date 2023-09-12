require("dotenv/config")
const Hapi = require("@hapi/hapi")
const album = require("./src/api/album")
const AlbumService = require("./src/service/postgresql/album")
const AlbumValidator = require("./src/validator/album")
const ClientError = require("./src/exceptions/ClientError")
const song = require("./src/api/song")
const SongService = require("./src/service/postgresql/song")
const SongValidator = require("./src/validator/song")

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
            }
        ]

        this.plugins.forEach((plugin) => {
            this.server.register(plugin)
        })
    }

    async start() {
        await this.register_plugins()

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
    