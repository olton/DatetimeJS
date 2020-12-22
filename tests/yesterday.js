let assert = require('assert');

require('../src/index');
require('../src/plugins/yesterday');

describe('Datetime', function() {
    describe('isYesterday()', () => {
        it ('Should be true', () => {
            var yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            assert.strictEqual(datetime(yesterday).isYesterday(), true);
        })
        it ('Should be false', () => {
            assert.strictEqual(datetime("1972-12-21").isYesterday(), false);
        })
        it ('Should be false', () => {
            assert.strictEqual(datetime("1972-12-21").yesterday().day(), 20);
            assert.strictEqual(datetime("1972-12-21").immutable().yesterday().day(), 20);
        })
    });
})