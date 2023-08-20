import { Server } from "@hapi/hapi"
import AlbumHandler from "./handler.js"
import AlbumRouter from "./router.js"

const album = {
    name: "album",
    version: "1.0.0",
    /**
     * 
     * @param {Server} server 
     * @param {*} param1 
     */
    register: async (server, { service, validator } ) => {
        const handler = new AlbumHandler(service, validator)
        const router = new AlbumRouter()
        server.route(router.run(handler))
    }
}

export default album