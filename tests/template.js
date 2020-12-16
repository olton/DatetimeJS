let assert = require('assert');
require('../build/datetime.all.js');

describe('Datetime test template', function() {
    it ('Should be true', () => {
        assert.strictEqual(true, true);
    })
    it ('Should be false', () => {
        assert.strictEqual(false, false);
    })
})