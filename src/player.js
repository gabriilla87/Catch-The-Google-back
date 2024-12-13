import {Unit} from "./unit.js";

export class Player extends Unit {
    constructor(position, id) {
        super(position, "Player " + id);
    }
}