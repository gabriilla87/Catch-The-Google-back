export class Unit {
    #name
    #position
    #score = 0

    constructor(position, name) {
        this.#position = position
        this.#name = name
    }

    clonePosition() {
        return {...this.#position}
    }

    set position(position) {
        this.#position = position
    }

    get position() {
        return this.#position
    }

    set score(score) {
        this.#score = score
    }

    get score() {
        return this.#score
    }
}