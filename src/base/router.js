class BaseRouter {
    constructor() {
        this.router = []
    }

    append(method, route, handler) {
        this.router.push({
            method: method,
            path: route,
            handler: handler
        })
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