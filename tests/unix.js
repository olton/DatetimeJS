let assert = require('assert');
require('../build/datetime.all.js');

describe('Datetime', function() {
    describe('unix()', () => {
        it ('Should be true for datetime(2020).unix() === new Date(2020).getTime() / 1000', () => {
            assert.strictEqual(datetime("2020").unix() === new Date("2020").getTime() / 1000, true);
        })
    });

})