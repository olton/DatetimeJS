let assert = require('assert');

require('../src/index');
require('../src/plugins/quarter');

describe('Datetime test template', function() {
    it("default, should be 1", () => {
        assert.strictEqual(datetime("2020-1").month(), 0);
        assert.strictEqual(datetime("2020-1").add(1, 'quarter').month(), 3);
        assert.strictEqual(datetime("2020-1").add(1, 'day').day(), 2);
    })
    it("default, should be 1", () => {
        assert.strictEqual(datetime("2020-1").month(), 0);
        assert.strictEqual(datetime("2020-1").addQuarter(1).month(), 3);
    })
    it ('Should be true', () => {
        assert.strictEqual(datetime("2020-2").quarter(), 1);
        assert.strictEqual(datetime("2020-5").quarter(), 2);
        assert.strictEqual(datetime("2020-9").quarter(), 3);
        assert.strictEqual(datetime("2020-11").quarter(), 4);
    })
    it ('Should be true', () => {
        assert.strictEqual(Datetime.align("2020-5", "quarter").month(), 3);
    })
    it ('Should be true', () => {
        assert.strictEqual(datetime("2020-5").align("quarter").month(), 3);
    })
    it ('Should be true', () => {
        assert.strictEqual(Datetime.alignEnd("2020-5", "quarter").month(), 5);
    })
    it ('Should be true', () => {
        assert.strictEqual(datetime("2020-5").alignEnd("quarter").month(), 5);
    })
    it ('Should be true', () => {
        assert.strictEqual(datetime("2020-5-12").alignEnd("month").day(), 31);
    })
})