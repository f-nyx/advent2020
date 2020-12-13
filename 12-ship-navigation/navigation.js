const fs = require('fs');

const parseNavOp = (line) => ({
    direction: line.substr(0, 1),
    distance: Number(line.substr(1))
});
const [ NORTH, SOUTH, EAST, WEST, LEFT, RIGHT, FORWARD ] = ['N', 'S', 'E', 'W', 'L', 'R', 'F'];

const Rotations = {
    0: (position) => ({ ...position }),
    90: (position) => ({ y: -position.x, x: position.y }),
    180: (position) => ({ y: -position.y, x: -position.x }),
    270: (position) => ({ y: position.x, x: -position.y }),
    360: (position) => ({ ...position })
};

const Movements = {
    [NORTH]: (position, distance) => ({ ...position, y: position.y + distance }),
    [SOUTH]: (position, distance) => ({ ...position, y: position.y - distance }),
    [EAST]: (position, distance) => ({ ...position, x: position.x + distance }),
    [WEST]: (position, distance) => ({ ...position, x: position.x - distance }),
    [LEFT]: (position, degrees) => Rotations[360 - degrees](position),
    [RIGHT]: (position, degrees) => Rotations[degrees](position)
};

function initialPlan(ops) {
    const position = { x: 0, y: 0 };

    return {
        forward(waypoint, op) {
            position.x += (waypoint.x * op.distance);
            position.y += (waypoint.y * op.distance);
            return position;
        },
        navigate() {
            ops.reduce((prevPosition, op) => {
                if (op.direction === LEFT || op.direction === RIGHT) {
                    prevPosition.waypoint = Movements[op.direction](prevPosition.waypoint, op.distance);
                    return prevPosition;
                } else if (op.direction === FORWARD) {
                    return { ...prevPosition, ...this.forward(prevPosition.waypoint, op) };
                } else {
                    return Movements[op.direction](prevPosition, op.distance);
                }
            }, { x: 0, y: 0, waypoint: { x: 1, y: 0 } }, this);
            return position;
        }
    };
}

function waypointPlan(ops) {
    const position = { x: 0, y: 0 };
    return {
        forward(waypoint, op) {
            position.x += (waypoint.x * op.distance);
            position.y += (waypoint.y * op.distance);
            return waypoint;
        },
        navigate() {
            ops.reduce((prevPosition, op) =>
                op.direction === FORWARD
                    ? this.forward(prevPosition, op)
                    : Movements[op.direction](prevPosition, op.distance)
            , { x: 10, y: 1 }, this);

            return position;
        }
    };
}

function run() {
    const ops = fs.readFileSync('input.txt')
        .toString()
        .split('\n')
        .filter(Boolean)
        .map(parseNavOp);

    const position1 = initialPlan(ops).navigate();
    console.log(position1);
    console.log('Manhattan distance:', Math.abs(position1.x) + Math.abs(position1.y));

    const position2 = waypointPlan(ops).navigate();
    console.log(position2);
    console.log('Manhattan distance:', Math.abs(position2.x) + Math.abs(position2.y));
}

run();
