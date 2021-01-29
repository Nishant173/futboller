export class KeyError extends Error {
    constructor(message) {
        super(message)
        this.name = "KeyError"
    }
}


export class LengthMismatchError extends Error {
    constructor(message) {
        super(message)
        this.name = "LengthMismatchError"
    }
}