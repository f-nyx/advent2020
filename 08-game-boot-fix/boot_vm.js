const fs = require('fs');

const parseOp = (line) => ({
    name: line.substr(0, line.indexOf(' ')),
    arg: Number(line.substr(line.indexOf(' ') + 1))
});
const [ ACC, NOP, JMP ] = ['acc', 'nop', 'jmp'];
const Operations = {
    [ACC]: (context, arg) => {
        context.r1 += arg;
        context.ip += 1;
    },
    [NOP]: (context) => {
        context.ip += 1;
    },
    [JMP]: (context, arg) => {
        context.ip += arg;
    }
};

function exec(ops) {
    const context = { ip: 0, r1: 0, ret: null, trace: [] };

    while (context.ip < ops.length) {
        const { name, arg } = ops[context.ip];

        if (context.trace.includes(context.ip)) {
            return context;
        } else {
            context.trace.push(context.ip);
        }

        Operations[name](context, arg);
    }

    return { ...context, ret: context.r1 };
}

function autofix(ctx, ops) {
    const Fixups = {
        [NOP]: (op) => op.name = JMP,
        [JMP]: (op) => op.name = NOP
    };
    let op;
    do {
        op = ops[ctx.trace.pop()];
    } while(!Fixups[op.name]);

    Fixups[op.name](op);

    const newCtx = exec(ops);

    if (newCtx.ret) {
        return newCtx;
    } else {
        return autofix(ctx, ops);
    }
}

function run() {
    const ops = fs.readFileSync('input.txt')
        .toString()
        .split('\n')
        .filter(Boolean)
        .map(parseOp);
    const ctx = exec(ops);
    console.log('infinite loop detected, current value:', ctx.r1);
    const newCtx = autofix(ctx, ops);
    console.log('program is not fixed', newCtx.ret);
}

run();
