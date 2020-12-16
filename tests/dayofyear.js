let assert = require('assert');

require('../src/index');
require('../src/plugins/isleapyear');
require('../src/plugins/dayofyear');

describe('Datetime', function() {
    describe('dayOfYear()', () => {
        it ('Should be 356 for 2020-12-21', () => {
            assert.strictEqual(datetime("2020-12-21").dayOfYear(), 356);
        })
    });
})