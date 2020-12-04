const fs = require('fs');
const DOOMED_YEAR = 2020;

function findMatch(expenses, evaluator) {
    if (!expenses.length) {
        return null;
    }

    const current = expenses.shift();
    const match = expenses.find(expense =>
        evaluator(current, expense)
    );

    if (match) {
        return [current, match];
    } else {
        return findMatch(expenses, evaluator);
    }
}

function findTwo(expenses) {
    return findMatch(expenses, (current, expense) =>
        current + expense === DOOMED_YEAR
    );
}

function findThree(expenses) {
    const match = findMatch(expenses, (current, expense) => {
        const candidate = DOOMED_YEAR - (current + expense);
        return candidate && expenses.includes(candidate);
    });

    if (match) {
        return [...match, DOOMED_YEAR - (match[0] + match[1])];
    }

    return match;
}


function printResult(match) {
    if (match) {
        const result = match.reduce((total, current) => total * current, 1);
        console.log('Match found:', match);
        console.log('Result:', result);
    } else {
        console.log('Match not found');
    }
}

function run() {
    const expenses = fs.readFileSync('input.txt')
        .toString()
        .split('\n')
        .map(expense => Number(expense));

    console.log('Expenses:', expenses);

    printResult(findTwo(expenses));
    printResult(findThree(expenses));
}

run();

