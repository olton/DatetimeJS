let assert = require('assert');

require('../src/index');
require('../src/plugins/transform');
require('../src/plugins/timezone');

describe('Datetime test template', function() {
    it ('Should be true', () => {
        assert.strictEqual(datetime("2020-1").utcOffset(), -120);
    })
    it ('Should be true', () => {
        assert.strictEqual(datetime("2020-1").timezone(), '+02:00');
    })
    it ('Should be true', () => {
        assert.strictEqual(datetime("2020-1").timezoneName(), 'GMT+02:00');
    })
    it ('Should be true', () => {
        assert.strictEqual(datetime("2020-1").format("Z ZZ"), '+02:00 +0200');
        assert.strictEqual(datetime("2020-1").utc().format("Z ZZ"), 'Z +0200');
        assert.strictEqual(datetime("2020-1").format(), '2020-01-01T00:00:00.000');
    })
})