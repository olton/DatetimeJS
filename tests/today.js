let assert = require('assert');
require('../build/datetime.all.js');

describe('Datetime plugin today', function() {
    describe('isToday()', () => {
        it ('Should be true', () => {
            assert.strictEqual(Datetime.isToday(new Date()), true);
        })
        it ('Should be true for 2020-12-21 and 2020-12-21', () => {
            var today = new Date();
            assert.strictEqual(datetime(today).isToday(), true);
        })
        it ('Should be false for 2020-12-21 and 2020-12-22', () => {
            assert.strictEqual(datetime("1972-12-21").isToday("2020-12-22"), false);
        })
        it ('Should be true', () => {
            assert.strictEqual(datetime().today().time() === new Date().getTime(), true);
        })
        it ('Should be false', () => {
            assert.strictEqual(datetime().today().time() === datetime().addDay(1).time(), false);
        })
        it ('Should be true', () => {
            let date = datetime().add(1, 'day');
            assert.strictEqual(date.today().time() === new Date().getTime(), true);
        })
    });
})