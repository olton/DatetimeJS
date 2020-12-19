let assert = require('assert');

require('../src/index');
require('../src/plugins/decade');

describe('Decade plugin test', function() {
    it ('Should be true', () => {
        assert.strictEqual(datetime("1972").decade(), 1970);
    })
    it ('Should be 1970', () => {
        assert.strictEqual(datetime("1972").decadeStart().year(), 1970);
    })
    it ('Should be 1970', () => {
        assert.strictEqual(datetime("1972").immutable().decadeStart().year(), 1970);
    })
    it ('Should be 1979', () => {
        assert.strictEqual(datetime("1972").decadeEnd().year(), 1979);
    })
    it ('Should be 1979', () => {
        assert.strictEqual(datetime("1972").immutable().decadeEnd().year(), 1979);
    })
    it ('Should be 2', () => {
        assert.strictEqual(datetime("2020-2-3").decadeOfMonth(), 1);
    })
    it ('Should be 2', () => {
        assert.strictEqual(datetime("2020-2-13").decadeOfMonth(), 2);
    })
    it ('Should be 3', () => {
        assert.strictEqual(datetime("2020-2-23").decadeOfMonth(), 3);
    })
    it ('Should be 1979', () => {
        assert.strictEqual(datetime("2020-2-13").immutable().decadeOfMonth(), 2);
    })
})