const fs = require('fs');

const LOWER = 0;
const UPPER = 1;
const TOTAL_ROWS = 128;
const TOTAL_COLUMNS = 8;

function partition(total, positions) {
    const ops = {
        [LOWER]: (range, diff) => ({ ...range, up: range.up - diff }),
        [UPPER]: (range, diff) => ({ ...range, low: range.low + diff })
    };
    const result = positions.reduce((range, position) =>
        ops[position](range, (range.up - range.low) / 2)
    , { low: 0, up: total });

    if (positions[positions.length - 1] === LOWER) {
        return result.low;
    } else {
        return result.up - 1;
    }
}

function seatId(ticket) {
    const row = partition(TOTAL_ROWS, ticket.slice(0, 7));
    const column = partition(TOTAL_COLUMNS, ticket.slice(-3));
    return row * 8 + column;
}

function run() {
    const seatsIds = fs.readFileSync('input.txt')
        .toString()
        .split('\n')
        .filter(Boolean)
        .map(ticket =>
            seatId(
                ticket
                    .replace(/[FL]/g, LOWER)
                    .replace(/[BR]/g, UPPER)
                    .split('').map(Number)
            )
        )
        .sort((seatId1, seatId2) => seatId1 - seatId2);
    console.log('Highest seat id:', seatsIds.slice(-1));

    const prevSeat = seatsIds.findIndex((seatId, index) =>
        seatsIds[index + 1] && seatsIds[index + 1] !== seatId + 1
    );
    console.log('My seat id:', seatsIds[prevSeat] + 1);
}

run();
