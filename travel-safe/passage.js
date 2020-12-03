const fs = require('fs');

const TREE = '#';
const SLOPES = [
    { right: 3, down: 1 },
    { right: 1, down: 1 },
    { right: 5, down: 1 },
    { right: 7, down: 1 },
    { right: 1, down: 2 }
];

class Map {
    static countTrees(path) {
        return path.reduce((total, point) => {
            if (point === TREE) {
                return total + 1;
            }  else {
                return total;
            }
        }, 0);
    }

    constructor(points)  {
        this.points = points;
    }

    getPath(slope) {
        const items = [];
        const numberOfRows = this.points.length;
        const numberOfColumns = this.points[0].length;
        let column = 0;

        for (let position = slope.down; position < numberOfRows; position += slope.down) {
            const row = position % numberOfRows;
            column += slope.right;
            items.push(this.points[row][column % numberOfColumns]);
        }

        return items;
    }
}

function run() {
    const points = fs.readFileSync('map.txt')
        .toString()
        .split('\n')
        .filter(Boolean)
        .map(row => row.split(''));
    const map = new Map(points);

    console.log('Trees with the first slope:', Map.countTrees(map.getPath(SLOPES[0])));

    const totalTrees = SLOPES.reduce((total, slope) => {
        const trees = Map.countTrees(map.getPath(slope));
        return total * (trees || 1);
    }, 1);

    console.log('Trees prob in all slopes:', totalTrees);
}

run();
