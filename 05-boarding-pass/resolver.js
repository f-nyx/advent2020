const fs = require('fs');

const LOWER = 0;
const UPPER = 1;
const TOTAL_ROWS = 128;
const TOTAL_COLUMNS = 8;

const RowMap = {
    F: LOWER,
    B: UPPER
};
const ColumnMap = {
    L: LOWER,
    R: UPPER
};

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

function findRow(ticket) {
    const positions = ticket.substr(0, 7).split("").map(position => RowMap[position]);
    return partition(TOTAL_ROWS, positions);
}

function findColumn(ticket) {
    const positions = ticket.substr(-3).split("").map(position => ColumnMap[position]);
    return partition(TOTAL_COLUMNS, positions);
}

function seatId(ticket) {
    return findRow(ticket) * 8 + findColumn(ticket);
}

function run() {
    const tickets = fs.readFileSync('input.txt')
        .toString()
        .split('\n')
        .filter(Boolean);
    const maxSeatId = tickets.reduce((max, ticket) =>
        Math.max(max, seatId(ticket))
    , 0);
    console.log('Highest seat id:', maxSeatId);
}

run();
