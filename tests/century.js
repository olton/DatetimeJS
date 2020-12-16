let assert = require('assert');
require('../build/datetime.all.js');

describe('Datetime', function() {
    describe('century()', () => {
        it ('Should be 20 for 2021', () => {
            assert.strictEqual(datetime("2021").century(), 20);
        })
    });
})