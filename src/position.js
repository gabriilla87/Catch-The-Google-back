import {CapuchinoNumber} from "./utils/capuchino-number.js";

export class Position {
    static #createNewPosition(numOfCol, numOfRows) {
        return {
            x: CapuchinoNumber.getRandomIntegerNumber(0, numOfCol),
            y: CapuchinoNumber.getRandomIntegerNumber(0, numOfRows),
        }
    }

    static placeEntity(excludePositions = [], numOfCol, numOfRows) {
        const newPosition = this.#createNewPosition(numOfCol, numOfRows);

        if (excludePositions.some(pos => pos?.x === newPosition.x && pos?.y === newPosition.y)) {
            return this.placeEntity(excludePositions, numOfCol, numOfRows);
        }

        return newPosition;
    }
}