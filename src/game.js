import {Position} from "./position.js";
import {Player} from "./player.js";
import {Google} from "./google.js";
import {MOVE_DIRECTIONS} from "./utils/MOVE_DIRECTIONS.js";
import {GAME_STATUSES} from "./utils/GAME_STATUSES.js";

export class Game {
    #status = GAME_STATUSES.PENDING
    // #jumpSound = new Audio('src/assets/audio/jumpSound.wav')
    // #googleJumpSound = new Audio('src/assets/audio/googleJumpSound.wav')
    #google
    #player1
    #player2
    #settings
    #settingsUtility
    #isPlayerWin = null
    #subscribers = []
    #googleInterval

    subscribe(listener) {
        this.#subscribers.push(listener)
        return () => {
            this.#subscribers = this.#subscribers.filter(s => s !== listener)
        }
    }

    #notify() {
        this.#subscribers.forEach(s => s())
    }

    constructor(settingsUtility) {
        this.#settingsUtility = settingsUtility
    }

    #isInsideGrid(newPosition) {
        return 0 <= newPosition.x && newPosition.x < this.#settings.gridSize.columnsCount
            && 0 <= newPosition.y && newPosition.y < this.#settings.gridSize.rowsCount
    }

    #isCellBusyByOtherPlayer(newPosition, player) {
        return player.position.x === newPosition.x && player.position.y === newPosition.y
    }

    #isPlayerCatchGoogle(newPosition) {
        return newPosition.x === this.#google.position.x && newPosition.y === this.#google.position.y
    }

    #googleJump(isGoogleCaught = false) {
        this.#google.position = Position.placeEntity([
            this.#google.position,
            this.#player1.position,
            this.#player2.position
        ], this.#settings.gridSize.columnsCount, this.#settings.gridSize.rowsCount)

        if (isGoogleCaught) {
            clearInterval(this.#googleInterval)
            this.#googleInterval = setInterval(() => {
                this.#googleJump()
                this.#notify()
            }, this.#settings.jumpInterval)
        } else {
            this.#google.score++
        }

        if (this.#google.score === this.#settings.googleWinningPoints) {
            this.#isPlayerWin = false
            this.#end()
        }

        if (this.#status === GAME_STATUSES.IN_PROGRESS && this.#settings.isSoundOn) {
            // this.#googleJumpSound.play()
        }
    }

    #placeGoogle() {
        const position = Position.placeEntity([],
            this.#settings.gridSize.columnsCount,
            this.#settings.gridSize.rowsCount
        )
        this.#google = new Google(position, "Google")
    }

    #setAPlayer1() {
        const position = Position.placeEntity([
            this.#google.position
        ], this.#settings.gridSize.columnsCount, this.#settings.gridSize.rowsCount)

        this.#player1 = new Player(position, 1)
    }

    #setAPlayer2() {
        const position = Position.placeEntity([
            this.#google.position,
            this.#player1.position
        ], this.#settings.gridSize.columnsCount, this.#settings.gridSize.rowsCount)

        this.#player2 = new Player(position, 2)
    }

    #movePlayer(direction, player, otherPlayer) {
        if (this.#status === GAME_STATUSES.IN_PROGRESS) {
            const newPosition = player.clonePosition()

            switch (direction) {
                case MOVE_DIRECTIONS.UP:
                    newPosition.y--
                    break
                case MOVE_DIRECTIONS.DOWN:
                    newPosition.y++
                    break
                case MOVE_DIRECTIONS.LEFT:
                    newPosition.x--
                    break
                case MOVE_DIRECTIONS.RIGHT:
                    newPosition.x++
                    break
                default:
                    throw new Error('Invalid direction')
            }

            // if (!this.#isInsideGrid(newPosition) || this.#isCellBusyByOtherPlayer(newPosition, otherPlayer)) return
            if (!this.#isInsideGrid(newPosition)) return

            if (this.#isPlayerCatchGoogle(newPosition)) {
                player.score++
                this.#googleJump(true)
            }

            if (player.score === this.#settings.playersWinningPoints) {
                this.#isPlayerWin = true
                this.#end()
            }

            player.position = newPosition

            this.#notify()
        }
    }

    movePlayer1(direction) {
        this.#movePlayer(direction, this.#player1, this.#player2)

        if (this.#status === GAME_STATUSES.IN_PROGRESS && this.#settings.isSoundOn) {
            // this.#jumpSound.play()
        }
    }

    movePlayer2(direction) {
        this.#movePlayer(direction, this.#player2, this.#player1)
    }

    returnToSettings() {
        this.#status = GAME_STATUSES.PENDING

        this.#notify()
    }

    // post/mutation/action/setter
    start() {
        this.#status = GAME_STATUSES.IN_PROGRESS

        this.#settings = this.#settingsUtility.settings

        this.#placeGoogle()

        this.#setAPlayer1()

        this.#setAPlayer2()

        if (this.#settings.isGoogleShouldMove) {
            this.#googleInterval = setInterval(() => {
                this.#googleJump()
                this.#notify()
            }, this.#settings.jumpInterval)
        }
    }

    #end() {
        this.#status = GAME_STATUSES.COMPLETED
        clearInterval(this.#googleInterval)
    }

    // selector/getter
    get status() {
        return this.#status
    }

    get settings() {
        return {
            ...this.#settings,
            gridSize: {
                ...this.#settings.gridSize
            }
        }
    }

    get googlePosition() {
        return {...this.#google?.position}
    }

    set player1Position(position) {
        this.#player1.position = position
    }

    set player2Position(position) {
        this.#player2.position = position
    }

    set googlePosition(position) {
        this.#google.position = position
    }

    get player1Position() {
        return {...this.#player1?.position}
    }

    get player2Position() {
        return {...this.#player2?.position}
    }

    get googleScore() {
        return this.#google?.score
    }

    get player1Score() {
        return this.#player1?.score
    }

    get intervalSettings() {
        return this.#settings.jumpInterval
    }

    get gridSize() {
        return this.#settings?.gridSize
    }

    get playersWinningPoints() {
        return this.#settings?.playersWinningPoints
    }

    get googleWinningPoints() {
        return this.#settings?.googleWinningPoints
    }

    get isPlayerWin() {
        return this.#isPlayerWin
    }
}