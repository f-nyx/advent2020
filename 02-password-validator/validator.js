const fs = require('fs');

const PASSWORD_LINE_PARSER = /(\d+)-(\d+) (\w): (\w+)/;

function parseAndCount(passwords) {
    return passwords.map(passwordLine => {
        const parsedLine = passwordLine.match(PASSWORD_LINE_PARSER);
        const char = parsedLine[3];
        const password = parsedLine[4];
        const charCountMap = password.split('').reduce((countMap, current) => {
            if (!countMap[current]) {
                countMap[current] = 0;
            }
            countMap[current] += 1;
            return countMap;
        }, {});

        return {
            line: passwordLine,
            min: Number(parsedLine[1]),
            max: Number(parsedLine[2]),
            char: parsedLine[3],
            count: charCountMap[char],
            password
        };
    });
}

function run() {
    const passwords = fs.readFileSync('input.txt')
        .toString()
        .split('\n')
        .filter(Boolean);
    const parsedPasswords = parseAndCount(passwords);
    const validPasswordsFormerPolicy = parsedPasswords.filter(auth =>
        auth.count >= auth.min && auth.count <= auth.max
    );
    console.log('Valid passwords former policy:', validPasswordsFormerPolicy.length);

    const validPasswordsNewPolicy = parsedPasswords.filter(auth => {
        const first = auth.password[auth.min - 1];
        const last = auth.password[auth.max - 1];
        return first !== last && (first === auth.char || last === auth.char);
    });
    console.log('Valid passwords new policy:', validPasswordsNewPolicy.length);
}

run();

