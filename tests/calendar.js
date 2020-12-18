let assert = require('assert');

require('../src/index');
require('../src/plugins/calendar');
require('../src/plugins/iso');

describe('Calendar plugin', function() {
    it ('Should be 42', () => {
        assert.strictEqual(Datetime.calendar("2020").days.length, 42);
    })
    it ('Should be 42', () => {
        assert.strictEqual(datetime("2020").calendar().days.length, 42);
    })
    it ('Should be 42', () => {
        assert.strictEqual(datetime("2020").calendar().weekdays.length, 7);
    })
    it ('Should be 42', () => {
        assert.strictEqual(datetime("2020").calendar(true).weekdays.length, 7);
    })
})