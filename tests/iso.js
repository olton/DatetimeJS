let assert = require('assert');

require('../src/index');
require('../src/plugins/iso');

describe('Datetime test template', function() {
    it ('Should be true', () => {
        assert.strictEqual(datetime("2020-12-20").isoWeekDay(), 7);
    })
    it ('Should be true', () => {
        assert.strictEqual(datetime("2020-12-20").isoWeekDay(5).day(), 18);
    })
    it ('Should be true', () => {
        assert.strictEqual(datetime("2020-12-22").isoWeekDay(), 2);
        assert.strictEqual(datetime("2020-12-22").isoWeekDay(5).day(), 25);
    })
    it ('Should be true', () => {
        assert.strictEqual(datetime("2020-12-22").format(), '2020-12-22T02:00:00.000Z');
        assert.strictEqual(datetime("2020-12-22").format("YYYY I"), '2020 2');
    })
    it ('Should be true', () => {
        assert.strictEqual(Datetime.align("2020-12-22", "isoWeek").format(), '2020-12-21T00:00:00.000Z');
    })
    it ('Should be true', () => {
        assert.strictEqual(Datetime.alignEnd("2020-12-22", "isoWeek").format(), '2020-12-27T23:59:59.999Z');
    })
})