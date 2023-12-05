const BaseRouter = require("../../base/router");
const UserHandler = require("./handler.js")

class UserRouter extends BaseRouter {
    /**
     * 
     * @param {UserHandler} handler
     */

    run(handler) {
        this.post("/users", (r, h) => handler.postUserHandler(r, h))
        return this.router
    }
}

module.exports = UserRouter