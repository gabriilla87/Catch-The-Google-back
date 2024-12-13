export class GridSettings {
    #columnsCount
    #rowsCount

    constructor(columnsCount = 4, rowsCount = 4) {
        this.#columnsCount = columnsCount
        this.#rowsCount = rowsCount
    }

    get gridSize() {
        return {
            columnsCount: this.#columnsCount,
            rowsCount: this.#rowsCount
        }
    }
}