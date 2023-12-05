const BaseRouter = require("../../base/router");
const AuthHandler = require("./handler")

class AuthRouter extends BaseRouter {
    /**
     * 
     * @param {AuthHandler} handler
     */
    run(handler) {
        this.post("/authentications", (r, h) => handler.postAuthenticationHandler(r, h))
        this.put("/authentications", (r, h) => handler.putAuthenticationHandler(r, h))
        this.delete("/authentications", (r, h) => handler.deleteAuthenticationHandler(r, h))
        return this.router
    }
}

module.exports = AuthRouter