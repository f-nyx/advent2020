const fs = require('fs');

function findInvalidNumber(chars) {
    const frame = chars.splice(0, 25);

    while (chars.length) {
        const char = chars.shift();
        const valid = frame.some(code => frame.includes(Math.abs(char - code)));

        if (!valid) {
            return char;
        }

        frame.shift()
        frame.push(char);
    }
}

function findSumSeries(chars, expected) {
    let rotations = 0;
    while (rotations < chars.length) {
        let count = 0;
        for (let i = 0; i < chars.length; i++) {
            count += chars[i];
            if (count > expected) {
                break;
            }
            if (chars[i] !== expected && count === expected) {
                return chars.slice(0, i);
            }
        }
        chars.unshift(chars.pop());
        rotations += 1;
    }

    return null;
}

function run() {
    const chars = fs.readFileSync('input.txt')
        .toString()
        .split('\n')
        .filter(Boolean)
        .map(Number);
    const invalidNumber = findInvalidNumber([...chars]);
    console.log(invalidNumber);

    const invalidSeries = findSumSeries([...chars], invalidNumber)
        .sort((char1, char2) => char1 - char2);
    console.log(invalidSeries.pop() + invalidSeries.shift());
}

run();
