const fs = require('fs');

function run() {
    const groups = fs.readFileSync('input.txt')
        .toString()
        .split('\n\n')
        .map(group => ({
            answers: group.replace(/\n/g, '').split('').sort(),
            peopleCount: group.split('\n').length
        }));

    const totalAnswersFromAnyone = groups.reduce((total, group) =>
        total + new Set(group.answers).size
    , 0);
    console.log('Total answers from anyone', totalAnswersFromAnyone);

    const totalAnswersFromEveryone = groups.reduce((total, group) =>
        total + Array.from(new Set(group.answers)).reduce(
            (total, char) => {
                const answerTotal = group.answers.lastIndexOf(char) - group.answers.indexOf(char) + 1;

                if (answerTotal === group.peopleCount) {
                    return total + 1;
                } else {
                    return total;
                }
            }, 0)
    , 0);
    console.log('Total answers from everyone', totalAnswersFromEveryone);
}

run();
