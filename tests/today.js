let assert = require('assert');
require('../build/datetime.all.js');

describe('Datetime plugin today', function() {
    describe('isToday()', () => {
        it ('Should be true for 2020-12-21 and 2020-12-21', () => {
            var today = new Date();
            assert.strictEqual(datetime(today).isToday(), true);
        })
        it ('Should be false for 2020-12-21 and 2020-12-22', () => {
            assert.strictEqual(datetime("1972-12-21").isToday("2020-12-22"), false);
        })
    });
})