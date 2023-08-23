export default class BaseQuery {
    constructor(text, values = []) {
        this.text = text
        this.values = values
    }

    raw() {
        return {
            text: this.text,
            values: this.values
        }
    }
}