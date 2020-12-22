let assert = require('assert');

require('../src/index');
require('../src/plugins/century');

describe('Datetime', function() {
    describe('century()', () => {
        it ('Should be 20 for 2021', () => {
            assert.strictEqual(datetime("2021").century(), 20);
        })
        it ('Should be 19 for 1972', () => {
            assert.strictEqual(datetime("1972").format('C'), '19');
        })
        it ('Should be 19 for 1972', () => {
            assert.strictEqual(datetime("1972").format(), '1972-01-01T03:00:00.000');
        })
    });
})