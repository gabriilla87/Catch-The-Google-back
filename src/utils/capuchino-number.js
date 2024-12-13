export class CapuchinoNumber {
    static getRandomIntegerNumber(fromInclusive, toExclusive) {
        return Math.floor(Math.random() * (toExclusive - fromInclusive) + fromInclusive);
    }
}