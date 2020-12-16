let assert = require('assert');
require('../build/datetime.all.js');

describe('Datetime Buddhist plugin', function() {
    describe('buddhist()', () => {
        it ('Should be 2563 for 2020', () => {
            assert.strictEqual(datetime("2020").buddhist(), 2563);
        })
        it ('Should be 2563 for 2020', () => {
            assert.strictEqual(datetime("2020").format('BB'), '63');
        })
        it ('Should be 2563 for 2020', () => {
            assert.strictEqual(datetime("2020").format('BBBB'), '2563');
        })
    });
})