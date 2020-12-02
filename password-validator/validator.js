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
    const validPasswords = parsedPasswords.filter(password =>
        password.count >= password.min && password.count <= password.max
    );
    console.log('Valid passwords:', validPasswords.length);
}

run();

