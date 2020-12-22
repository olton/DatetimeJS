let assert = require('assert');

require('../src/index');
require('../src/plugins/hour12');

describe('Datetime', function() {
    describe('ampm()', () => {
        it ('Should be PM for 2020 20:00', () => {
            assert.strictEqual(datetime("2020 20:00").ampm(), "PM");
        })
        it ('Should be am for 2020 10:00 and true for second argument', () => {
            assert.strictEqual(datetime("2020 10:00").ampm(true), "am");
        })
        it ('Should be am for 2020 10:00 and true for second argument', () => {
            assert.strictEqual(datetime("2020 10:00").hour12(), 10);
        })
        it ('Should be 11', () => {
            assert.strictEqual(datetime("2020 10:00").hour12(11).hour(), 11);
        })
        it ('Should be 11', () => {
            assert.strictEqual(datetime("2020 10:00").hour12(11, "pm").hour(), 23);
        })
        it ('Should be formated', () => {
            assert.strictEqual(datetime("2020 10:00").format(), "2020-01-01T10:00:00.000");
        })
        it ('Should be formated', () => {
            assert.strictEqual(datetime("2020 10:00").format("YYYY hh:mm"), "2020 10:00");
        })
    });

})