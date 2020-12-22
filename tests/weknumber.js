let assert = require('assert');

require('../src/index');
require('../src/plugins/transform');
require('../src/plugins/timezone');
require('../src/plugins/weeknumber');

describe('Datetime test template', function() {
    it ('Should be true', () => {
        assert.strictEqual(datetime("1972-12-21").weekNumber(), 51);
    })
    it ('Should be true', () => {
        assert.strictEqual(datetime("2020-12-21").weekNumber(1), 52);
    })
    it ('Should be true', () => {
        assert.strictEqual(datetime("2020-12-28").weekNumber(1), 53);
    })
    it ('Should be true', () => {
        assert.strictEqual(datetime("2020-12-28").isoWeekNumber(), 53);
    })
    it ('Should be true', () => {
        assert.strictEqual(datetime("2020-1-28").format("W WW WWW WWWW"), '5 05 5 05');
        assert.strictEqual(datetime("2020-12-28").format("W WW WWW WWWW"), '53 53 53 53');
        assert.strictEqual(datetime("2020-12-28").format(), '2020-12-28T02:00:00.000');
    })
})