import { Server } from "@hapi/hapi"
import SongHandler from "./handler.js"
import SongRouter from "./router.js"

const song = {
    name: "song",
    version: "1.0.0",

    /**
     * 
     * @param {Server} server 
     * @param {*} param1 
     */
    register: async (server, { service, validator }) => {
        const handler = new SongHandler(service, validator)
        const router = new SongRouter()

        server.route(router.run(handler))
    }
}

export default song