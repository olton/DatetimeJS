let assert = require('assert');

require('../src/index');
require('../src/plugins/buddhist');

describe('Datetime Buddhist plugin', function() {
    describe('buddhist()', () => {
        it ('Should be 2563 for 2020', () => {
            assert.strictEqual(datetime("2020").buddhist(), 2563);
        })
        it ('Should be 2563 for 2020', () => {
            assert.strictEqual(datetime("2020").format('BB'), '63');
        })
        it ('Should be 2563 for 2020', () => {
            assert.strictEqual(datetime("2020").format(), '2020-01-01T02:00:00.000Z');
        })
        it ('Should be 2563 for 2020', () => {
            assert.strictEqual(datetime("2020").format('BBBB'), '2563');
        })
    });
})