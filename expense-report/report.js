const fs = require('fs');
const EXPECTED_SUM = 2020;


function findMatch(expenses) {
    if (!expenses.length) {
        return null;
    }

    const current = expenses.shift();
    const match = expenses.find(expense =>
        expense + current === EXPECTED_SUM
    );

    if (match) {
        return [current, match];
    } else {
        return findMatch(expenses);
    }
}

function run() {
    const expenses = fs.readFileSync('input.txt')
        .toString()
        .split('\n')
        .map(expense => Number(expense));

    console.log('Expenses:', expenses);
    const match = findMatch(expenses);

    if (match) {
        console.log('Match found:', match);
        console.log('Result:', match[0] * match[1]);
    } else {
        console.log('Match not found');
    }
}

run();

