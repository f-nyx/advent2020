const fs = require('fs');

const TOTAL_FIELDS = 8;
const REQUIRED_FIELDS = 7;
const NUMERIC_FIELDS = [ 'byr', 'iyr', 'eyr', 'cid'];

function parsePassports(passports) {
    return passports.map(passportLine => {
        const fields = passportLine.split(/[\s\n]/).filter(Boolean);
        return fields.reduce((passport, field) => {
            const name = field.substr(0, field.indexOf(':'));
            const value = field.substr(field.indexOf(':') + 1);
            return {
                ...passport,
                [name]: NUMERIC_FIELDS.includes(name) && value ? Number(value) : value
            };
        }, {});
    });
}

function validateFieldCount(passport) {
    const fieldCount = Object.keys(passport).length;
    return fieldCount === TOTAL_FIELDS || (
        fieldCount === REQUIRED_FIELDS && !passport.hasOwnProperty('cid')
    );
}

function validateData(passport) {
    const validYear = (field, from, to) =>
        () => passport[field] && String(passport[field]).length === 4 && passport[field] >= from && passport[field] <= to;
    const validHeight = () => {
        const result = passport.hgt && /^(\d+)(cm|in)$/.exec(passport.hgt);
        const height = result && Number(result[1])
            , unit = result && result[2];
        const validCm = height && (unit !== 'cm' || (height >= 150 && height <= 193))
            , validIn = height && (unit !== 'in' || (height >= 59 && height <= 76));
        return validCm && validIn;
    };
    const validHairColor = () => /^#[\dabcdef]{6}$/.test(passport.hcl);
    const validEyeColor = () => ['amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth'].includes(passport.ecl);
    const validPassportId = () => /^\d{9}$/.test(passport.pid);
    return [
        validYear('byr', 1920, 2002), validYear('iyr', 2010, 2020), validYear('eyr', 2020, 2030),
        validHeight, validHairColor, validEyeColor, validPassportId
    ].every(validator => validator());
}

function run() {
    const passports = parsePassports(
        fs.readFileSync('input.txt')
            .toString()
            .split('\n\n')
            .filter(Boolean)
    );
    const passportsWithValidFields = passports.filter(validateFieldCount);
    const passportsWithValidData = passportsWithValidFields.filter(validateData);
    console.log('Passports with valid fields:', passportsWithValidFields.length);
    console.log('Passports with valid data:', passportsWithValidData.length);
}

run();
