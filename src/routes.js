import BaseRouter from "./base/router.js"

export default class Routes extends BaseRouter {
    run() {
        this.get("/", function (req, h) {
            return "ok"
        })
    }
}