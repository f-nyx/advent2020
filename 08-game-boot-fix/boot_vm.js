const fs = require('fs');

const parseOp = (line) => ({
    op: line.substr(0, line.indexOf(' ')),
    arg: Number(line.substr(line.indexOf(' ') + 1))
});

const Operations = {
    acc(context, arg) {
        context.r1 += arg;
        context.ip += 1;
    },
    nop(context) {
        context.ip += 1;
    },
    jmp(context, arg) {
        context.ip += arg;
    }
};

function printStackTrace(ops, trace) {
    const stacktrace = trace.reverse().map(ip => `Ln ${ip}: ${ops[ip].op} ${ops[ip].arg}`);
    console.log('Infinite loop detected. Stacktrace (last 15 frames):', JSON.stringify(stacktrace.slice(0, 15), null, 2));
}

function exec(lines) {
    const context = { ip: 0, r1: 0 };
    const ops = lines.map(parseOp);
    const trace = [];

    while (context.ip < ops.length) {
        const { op, arg } = ops[context.ip];

        if (trace.includes(context.ip)) {
            printStackTrace(ops, trace);
            return context.r1;
        } else {
            trace.push(context.ip);
        }

        Operations[op](context, arg);
    }

    return context.r1;
}

function run(programFile) {
    const lines = fs.readFileSync(programFile)
        .toString()
        .split('\n')
        .filter(Boolean);
    const acc = exec(lines);
    console.log(`${programFile}: ${acc}`);
}

run('input_error.txt');
run('input_ok.txt');
