let assert = require('assert');

require('../src/index');
require('../src/plugins/unix');

describe('unix()', () => {
    it ('Should be true', () => {
        assert.strictEqual(Datetime.timestamp() === new Date().getTime() / 1000, true);
    })
    it ('Should be true for datetime(2020).unix() === new Date(2020).getTime() / 1000', () => {
        assert.strictEqual(datetime("2020").unix() === new Date("2020").getTime() / 1000, true);
    })
    it ('Should be true', () => {
        assert.strictEqual(datetime("2020-12-21").unix(), 1608508800);
        assert.strictEqual(datetime("2020-12-21").unix(null), 1608508800);
    })
    it ('Should be true', () => {
        assert.strictEqual(datetime("2020-12-21").unix(1608508801).unix(), 1608508801);
    })
    it ('Should be true', () => {
        assert.strictEqual(datetime("2020-12-21").immutable().unix(1608508801).unix(), 1608508801);
    })
    it ('Should be true', () => {
        assert.strictEqual(datetime("2020-12-21").timestamp(), 1608508800);
    })
});
