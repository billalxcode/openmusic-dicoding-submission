class BaseRouter {
    constructor() {
        this.router = []
        this.auth = null
    }

    append(method, route, handler) {
        this.router.push({
            method: method,
            path: route,
            handler: handler,
            options: {
                auth: this.auth
            }
        })
    }

    setAuth(name) {
        this.auth = name
    }

    get(route, handler) {
        this.append("GET", route, handler)
    }

    post(route, handler) {
        this.append("POST", route, handler)
    }

    delete(route, handler) {
        this.append("DELETE", route, handler)
    }

    put(route, handler) {
        this.append("PUT", route, handler)
    }
    
    run() {
        
    }
}

module.exports = BaseRouter