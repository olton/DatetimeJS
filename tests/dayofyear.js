let assert = require('assert');

require('../src/index');
require('../src/plugins/isleapyear');
require('../src/plugins/dayofyear');

describe('dayOfYear()', () => {
    it ('Should be 356 for 2020-12-21', () => {
        assert.strictEqual(datetime("2020-12-21").dayOfYear(), 356);
    })
    it ('Should be 356 for 2020-12-21', () => {
        assert.strictEqual(datetime("2021-12-21").dayOfYear(), 355);
    })
});
