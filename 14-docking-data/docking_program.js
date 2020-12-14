const fs = require('fs');

const [ OP_MASK, OP_MEM ] = ['mas', 'mem'];
const NUMBER_LENGTH = 36;

function parseOp(context, line) {
    const Parsers = {
        [OP_MASK]: () => {
            if (context.current) {
                context.ops.push(context.current);
            }
            context.current = {
                mask: line.substr(line.indexOf('=') + 1).trim(),
                memory: {}
            };
            return context;
        },
        [OP_MEM]: () => {
            const [, address, value] = line.match(/^mem\[(\d+)] = (\d+)$/);
            context.current.memory[address] = Number(value);
            return context;
        }
    };
    return Parsers[line.substr(0, 3)]();
}

function parse(input) {
    const context = input.split('\n')
        .filter(Boolean)
        .reduce(parseOp, { ops: [] });
    context.ops.push(context.current);
    return context.ops;
}

function toDecimal(maskedBinary) {
    if (Array.isArray(maskedBinary)) {
        return parseInt(maskedBinary.join(''), 2);
    } else {
        return parseInt(maskedBinary, 2);
    }
}

function applyMask(mask, value, floating = false) {
    const binary = [...value.toString(2).padStart(NUMBER_LENGTH, '0')];
    return binary.map((bit, index) =>
        mask[index] !== 'X' || floating ? mask[index] : bit
    );
}

function maskMemoryValues(ops) {
    return ops.reduce((memory, op) =>
        Object.entries(op.memory).reduce((memory, [address, value]) => ({
            ...memory,
            [address]: toDecimal(applyMask(op.mask, value))
        }), memory)
    , {});
}

function run() {
    const ops = parse(fs.readFileSync('input.txt').toString());
    const memory = maskMemoryValues(ops);
    const bootValue = Object.values(memory).reduce((total, value) => total + value, 0);
    console.log('Boot value', bootValue);
}

run();
