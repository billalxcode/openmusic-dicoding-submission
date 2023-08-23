import "dotenv/config.js"
import Hapi from "@hapi/hapi"
import song from "./src/api/song/index.js"
import album from "./src/api/album/index.js"
import AlbumValidator from "./src/validator/album/index.js"
import AlbumService from "./src/services/postgres/album.js"
import ClientError from "./src/exceptions/ClientError.js"
import NotFoundError from "./src/exceptions/NotFoundError.js"
import SongService from "./src/services/postgres/song.js"
import SongValidator from "./src/validator/song/index.js"

class EventHandler {
    /**
     * 
     * @param {Hapi.Request} request 
     * @param {Hapi.ResponseToolkit} h 
     */
    preResponse(request, h) {
        const { response } = request

        if (response instanceof Error) {
            if (response instanceof NotFoundError) {
                return h.response({
                    status: "fail",
                    message: response.message
                }).code(404)
            }

            if (response instanceof ClientError) {
                return h.response({
                    status: "fail",
                    message: response.message
                }).code(response.statusCode)
            }

            if (!response.isServer) return h.continue
            console.log(response)
            return h.response({
                status: "error",
                message: "something error"
            }).code(500)
            
        }
        return h.continue
    }
}

class App {
    constructor() {
        console.clear()
        this.eventHandler = new EventHandler()

        this.server = Hapi.server({
            host: process.env.HOST ?? "localhost",
            port: process.env.PORT ?? 3000,
            routes: {
                cors: {
                    origin: ["*"]
                }
            }
        })

        this.albumService = new AlbumService()
        this.songService = new SongService()
    }

    async registerPlugins() {
        await this.server.register({
            plugin: album,
            options: {
                service: this.albumService,
                validator: new AlbumValidator()
            }
        })

        await this.server.register({
            plugin: song,
            options: {
                service: this.songService,
                validator: new SongValidator()
            }
        })
    }

    handleEvent() {
        this.server.ext("onPreResponse", this.eventHandler.preResponse)
    }
    
    async start() {
        await this.registerPlugins()

        this.handleEvent()

        console.log(`running server on ${this.server.info.uri}`)
        await this.server.start()
    }
}

const app = new App()
app.start()