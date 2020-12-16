let assert = require('assert');
require('../build/datetime.all.js');

describe('Datetime', function() {
    describe('ampm()', () => {
        it ('Should be PM for 2020 20:00', () => {
            assert.strictEqual(datetime("2020 20:00").ampm(), "PM");
        })
        it ('Should be am for 2020 10:00 and true for second argument', () => {
            assert.strictEqual(datetime("2020 10:00").ampm(true), "am");
        })
    });

})