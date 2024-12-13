export class Settings {
    #settings = {
        gridSize: {
            columnsCount: 0,
            rowsCount: 0
        },
        jumpInterval: 0,
        googleWinningPoints: 0,
        playersWinningPoints: 0,
        isGoogleShouldMove: true,
        isSoundOn: false
    }

    constructor(
        gridSizeUtility,
        isGoogleShouldMove = true,
        jumpInterval = 1000,
        googleWinningPoints = 5,
        playersWinningPoints = 5,
    ) {
        this.#settings.gridSize = gridSizeUtility.gridSize
        this.#settings.jumpInterval = jumpInterval
        this.#settings.googleWinningPoints = googleWinningPoints
        this.#settings.playersWinningPoints = playersWinningPoints
        this.#settings.isGoogleShouldMove = isGoogleShouldMove
    }

    get settings() {
        return this.#settings
    }

    set settings(settings) {
        if (settings.gridSize && settings.gridSize.columnsCount * settings.gridSize.rowsCount < 4) {
            throw new Error('401: Cells count should be 4 or more')
        }

        this.#settings = {
            gridSize: settings.gridSize ?
                {...settings.gridSize} :
                this.#settings.gridSize,
            jumpInterval: settings.jumpInterval ?
                settings.jumpInterval :
                this.#settings.jumpInterval,
            googleWinningPoints: settings.googleWinningPoints ?
                settings.googleWinningPoints :
                this.#settings.googleWinningPoints,
            playersWinningPoints: settings.playersWinningPoints ?
                settings.playersWinningPoints :
                this.#settings.playersWinningPoints,
            isGoogleShouldMove: settings.isGoogleShouldMove ?
                settings.isGoogleShouldMove :
                this.#settings.isGoogleShouldMove,
            isSoundOn: settings.isSoundOn ?
                settings.isSoundOn :
                this.#settings.isSoundOn
        }
    }
}