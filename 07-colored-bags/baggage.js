const fs = require('fs');

const MY_COLOR = 'shiny gold';

const normalize = (line) => line.replace(/[.,]/g, '');
const tokenize = (line) => line.split(/(\d \w+\s\w+ bag)s?/).map(token => token.trim()).filter(Boolean);
const parseTo = (bagsIndex, line) => {
    const tokens = tokenize(normalize(line));
    const parentColor = tokens.shift().match(/^(\w+\s\w+) bags contain/)[1];
    bagsIndex[parentColor] = tokens.map(token => {
        const [, count, color] = token.match(/^(\d) (\w+\s\w+) bags?$/);
        return { count: Number(count), color };
    });
    return bagsIndex;
};

function getTree(bagsIndex, color) {
    return bagsIndex[color].reduce((results, bag) =>
        [...results, ...getTree(bagsIndex, bag.color)]
    , [color]);
}

function calculateTotal(bagsIndex, color) {
    return bagsIndex[color].reduce((total, bag) =>
        total + bag.count + (bag.count * calculateTotal(bagsIndex, bag.color))
    , 0);
}

function run() {
    const bagsIndex = fs.readFileSync('input.txt')
        .toString()
        .split('\n')
        .reduce(parseTo, {});

    const totalShinyGold = Object.keys(bagsIndex).reduce((total, color) =>
        color !== MY_COLOR && getTree(bagsIndex, color).includes(MY_COLOR) ? total + 1 : total
    , 0);
    console.log(totalShinyGold);
    console.log(calculateTotal(bagsIndex, MY_COLOR));
}

run();
