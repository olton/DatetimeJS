let assert = require('assert');

require('../src/index');
require('../src/plugins/tomorrow');

describe('Datetime', function() {
    describe('isTomorrow()', () => {
        it ('Should be true for 2020-12-21 and 2020-12-22', () => {
            var tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            assert.strictEqual(datetime(tomorrow).isTomorrow(), true);
        })
        it ('Should be false for 2020-12-21 and 2020-12-20', () => {
            assert.strictEqual(datetime("1972-12-21").isTomorrow(), false);
        })
    });
})