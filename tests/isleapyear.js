let assert = require('assert');
require('../build/datetime.all.js');

describe('Plugin isLeapYear()', () => {
    it ('Should be true for 2020', () => {
        assert.strictEqual(datetime("2020").isLeapYear(), true);
    })
    it ('Should be false for 2021', () => {
        assert.strictEqual(datetime("2021").isLeapYear(), false);
    })
});
