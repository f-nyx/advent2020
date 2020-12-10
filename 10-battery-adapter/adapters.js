const fs = require('fs');

const CHARGING_OUTLET_JOLTS = 0;

function countDifferences(adapters) {
    const [diffMap] = adapters.reduce(([diffMap, prev], jolts) => {
        const diff = jolts - prev;

        if (!diffMap[diff]) {
            diffMap[diff] = 0;
        }

        diffMap[diff] += 1;

        return [diffMap, jolts];
    }, [{}, CHARGING_OUTLET_JOLTS]);

    // Device difference is always 3 higher than the max adapter.
    diffMap[3] += 1;

    return diffMap;
}

function run() {
    const adapters = fs.readFileSync('input.txt')
        .toString()
        .split('\n')
        .filter(Boolean)
        .map(Number)
        .sort((adapter1, adapter2) => adapter1 - adapter2);

    const diffMap = countDifferences(adapters);
    console.log('Difference factor:', diffMap[1] * diffMap[3]);
}

run();
