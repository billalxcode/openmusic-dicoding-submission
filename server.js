import "dotenv/config.js"
import Hapi from "@hapi/hapi"
import album from "./src/api/album/index.js"
import AlbumValidator from "./src/validator/album/index.js"
import AlbumService from "./src/services/postgres/album.js"

class App {
    constructor() {
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
    }

    async registerPlugins() {
        console.log("register album plugin")
        await this.server.register({
            plugin: album,
            options: {
                service: this.albumService,
                validator: new AlbumValidator()
            }
        })
    }

    async start() {
        await this.registerPlugins()
        console.log(`running server on ${this.server.info.uri}`)
        await this.server.start()
    }
}

const app = new App()
app.start()