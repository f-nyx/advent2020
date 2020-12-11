const fs = require('fs');

const EMPTY_SEAT = 'L';
const OCCUPIED_SEAT = '#';
const FLOOR = '.';

function countSeats(seatMap, seatStatus) {
    return seatMap.reduce((total, seat) => seat === seatStatus ? total + 1 : total, 0);
}

function SeatMap(input) {
    const columns = input.indexOf('\n');

    const NeighborResolver = {
        left: (seats, col, position, distance = 1) =>
            col - distance < 0 ? undefined : seats[position - distance],
        right: (seats, col, position, distance = 1) =>
            (col % columns) + distance >= columns ? undefined : seats[position + distance],
        top: (seats, position, distance = 1) =>
            seats[position - (columns * distance)],
        topLeft: (seats, col, position, distance = 1) => {
            const index = position - (columns * distance) - distance;
            return index % columns >= col ? undefined : seats[index];
        },
        topRight: (seats, col, position, distance = 1) => {
            const index = position - (columns * distance) + distance;
            return index % columns <= col ? undefined : seats[index];
        },
        bottom: (seats, position, distance = 1) =>
            seats[position + (columns * distance)],
        bottomLeft: (seats, col, position, distance = 1) => {
            const index = position + (columns * distance) - distance;
            return index % columns >= col ? undefined : seats[index];
        },
        bottomRight: (seats, col, position, distance = 1) => {
            const index = position + (columns * distance) + distance;
            return index % columns <= col ? undefined : seats[index];
        }
    };

    function nextSeatMap(seats, tolerance, resolveNeighbors) {
        return seats.map((seat, index) => {
            const neighbors = resolveNeighbors(seats, index % columns, index);
            const occupied = countSeats(neighbors, OCCUPIED_SEAT);
            if (seat === EMPTY_SEAT && occupied === 0) {
                return OCCUPIED_SEAT;
            }
            if (seat === OCCUPIED_SEAT && occupied >= tolerance) {
                return EMPTY_SEAT;
            }
            return seat;
        });
    }

    function getNeighbors(seats, col, index, distance = 1) {
        return [
            NeighborResolver.left(seats, col, index, distance),
            NeighborResolver.right(seats, col, index, distance),
            NeighborResolver.top(seats, index, distance),
            NeighborResolver.topLeft(seats, col, index, distance),
            NeighborResolver.topRight(seats, col, index, distance),
            NeighborResolver.bottom(seats, index, distance),
            NeighborResolver.bottomLeft(seats, col, index, distance),
            NeighborResolver.bottomRight(seats, col, index, distance)
        ];
    }

    function getVisibleNeighbors(seats, col, index) {
        let distance = 1;
        let visible = getNeighbors(seats, col, index, distance);

        while(visible.includes(FLOOR)) {
            visible = getNeighbors(seats, col, index, ++distance).map((neighbor, index) =>
                visible[index] === FLOOR ? neighbor : visible[index]
            );
        }

        return visible;
    }

    function findStableMap(tolerance, resolveNeighbors) {
        let prevMap = [...input.replace(/\n/g, '')];
        let nextMap;
        let equals = false;

        do {
            prevMap = nextMap || prevMap;
            nextMap = nextSeatMap(prevMap, tolerance, resolveNeighbors);
            equals = prevMap.every((seat, index) => seat === nextMap[index]);
        } while (!equals);

        return nextMap;
    }

    return {
        neighborsMap() {
            return findStableMap(4, getNeighbors);
        },
        visibleNeighborsMap() {
            return findStableMap(5, getVisibleNeighbors);
        }
    };
}

function run() {
    const input = fs.readFileSync('input.txt').toString();
    const seatMap = SeatMap(input);
    console.log('part 1:', countSeats(seatMap.neighborsMap(), OCCUPIED_SEAT));
    console.log('part 2:', countSeats(seatMap.visibleNeighborsMap(), OCCUPIED_SEAT));
}

run();
