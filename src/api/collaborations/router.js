const BaseRouter = require("../../base/router");
const CollaborationHandler = require("./handler");

class CollaborationRouter extends BaseRouter {
    /**
     * 
     * @param {CollaborationHandler} handler 
     */
    run(handler) {
        this.setAuth("openmusic_jwt")
        this.post("/collaborations", (r, h) => handler.postCollabrationHandler(r, h))
        this.delete("/collaborations", (r, h) => handler.deleteCollaborationHandler(r, h))

        return this.router
    }
}

module.exports = CollaborationRouter