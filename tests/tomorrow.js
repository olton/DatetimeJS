let assert = require('assert');

require('../src/index');
require('../src/plugins/tomorrow');

describe('isTomorrow()', () => {
    it ('Should be true', () => {
        assert.strictEqual(Datetime.isTomorrow("1972-12-21"), false);
    })
    it ('Should be true', () => {
        var tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        assert.strictEqual(datetime(tomorrow).isTomorrow(), true);
    })
    it ('Should be false', () => {
        assert.strictEqual(datetime("1972-12-21").isTomorrow(), false);
    })
    it ('Should be 22', () => {
        assert.strictEqual(datetime("1972-12-21").tomorrow().day(), 22);
    })
    it ('Should be 22', () => {
        assert.strictEqual(datetime("1972-12-21").immutable().tomorrow().day(), 22);
    })
});
