const BaseRouter = require("../../base/router");
const UserHandler = require("./handler.js")

class UserRouter extends BaseRouter {
    /**
     * 
     * @param {UserHandler} handler
     */

    run(handler) {
        this.post("/users", handler.postUserHandler)
        return this.router
    }
}

module.exports = UserRouter