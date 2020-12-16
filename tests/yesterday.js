let assert = require('assert');

require('../src/index');
require('../src/plugins/yesterday');

describe('Datetime', function() {
    describe('isYesterday()', () => {
        it ('Should be true for 2020-12-21 and 2020-12-20', () => {
            var yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            assert.strictEqual(datetime(yesterday).isYesterday(), true);
        })
        it ('Should be false for 2020-12-21 and 2020-12-22', () => {
            assert.strictEqual(datetime("1972-12-21").isYesterday(), false);
        })
    });
})