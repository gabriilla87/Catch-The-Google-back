import {WebSocketServer} from "ws";
import {GridSettings} from "./src/gridSettings.js";
import {Settings} from "./src/settings.js";
import {Game} from "./src/game.js";

const server = new WebSocketServer({ port: 3009 }, () => {
    console.log("WebSocket сервер запущен на ws://localhost:3009")
})

const gridSettings = new GridSettings()
const settings = new Settings(gridSettings)
const game = new Game(settings)

server.on('connection', (channel) => {
    console.log('new user connected')

    game.subscribe(() => {
        const {
            googlePosition,
            player1Position,
            status,
            isPlayerWin,
            googleWinningPoints,
            playersWinningPoints,
            gridSize,
            player1Score,
            googleScore,
        } = game

        channel.send(JSON.stringify({
            googlePosition,
            player1Position,
            status,
            isPlayerWin,
            googleWinningPoints,
            playersWinningPoints,
            gridSize,
            player1Score,
            googleScore
        }))
    })

    channel.on('message', (data) => {
        const parsedData = JSON.parse(data)

        switch (parsedData.type) {
            case ("START-GAME"):
                game.start()
                break
            case ("MOVE-PLAYER"):
                game.movePlayer1(parsedData.payload)
                break
            case ("RETURN-TO-MAIN"):
                game.returnToSettings()
                break
            case ("CHANGE-SETTINGS"):
                settings.settings = parsedData.payload
                break
            // case ("MOVE-UP"):
            //     game.movePlayer1(MOVE_DIRECTIONS.UP)
            //     break
            // case ("MOVE-DOWN"):
            //     game.movePlayer1(MOVE_DIRECTIONS.DOWN)
            //     break
            // case ("MOVE-RIGHT"):
            //     game.movePlayer1(MOVE_DIRECTIONS.RIGHT)
            //     break
            // case ("MOVE-LEFT"):
            //     game.movePlayer1(MOVE_DIRECTIONS.LEFT)
            //     break
            default:
                throw new Error("wrong type")
        }
    })
})