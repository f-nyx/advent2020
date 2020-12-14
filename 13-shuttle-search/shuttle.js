const fs = require('fs');
// const gcd = require('./gcd');

function findBuses(departureTime, buses) {
    return buses.filter(busId => departureTime % busId === 0);
}

function findEarliestBus(input) {
    const departureTime = Number(input[0]);
    const buses = input[1].split(',')
        .filter(busId => busId !== 'x')
        .map(Number);

    for (let i = 0; i < departureTime; i++) {
        const [ bus ] = findBuses(departureTime + i, buses);

        if (bus) {
            return [bus, i];
        }
    }
}
const gcd = (a, b) => {
    const [big, small] = [a, b].sort((a1, a2) => a2 - a1);
    const remainder = big % small
    return remainder === 0 ? small : gcd(small, remainder)
}
const lcm = (a, b) => (a * b) / gcd(a, b)

function run() {
    const input = fs.readFileSync('input.txt')
        .toString()
        .split('\n')
        .filter(Boolean);
    const [ bus, offset ] = findEarliestBus(input);
    console.log(`bus ${bus} departs in ${offset} minutes. Result: ${bus * offset}`);

    const buses = input[1].split(',')
        .map(busId => busId === 'x' ? 1 : Number(busId));
    const result = buses.reduce(({ timestamp, step }, busId, index) => {
        if (busId === 1) return { timestamp, step }

        let newTimestamp = timestamp
        while ((newTimestamp + index) % busId !== 0) {
            newTimestamp = newTimestamp + step
        }

        return {
            timestamp: newTimestamp,
            step: step === 0 ? busId : lcm(step, busId)
        }
    }, { timestamp: 0, step: 0 });

    console.log('Result', result);
}

run();
