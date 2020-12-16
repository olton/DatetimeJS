let assert = require('assert');
require('../build/datetime.all.js');

describe('Datetime Utils', function() {
    describe('lpad()', () => {
        it ('Should be 009', () => {
            assert.strictEqual(Datetime.lpad(9, "0", 3), '009');
        })
        it ('Should be true for null', () => {
            assert.strictEqual(Datetime.not(null), true);
        })
        it ('Should be true for undefined', () => {
            assert.strictEqual(Datetime.not(), true);
        })
        it ('Should be true for undefined', () => {
            assert.strictEqual(Datetime.not(undefined), true);
        })
        it ('Should be false for 0', () => {
            assert.strictEqual(Datetime.not(0), false);
        })
        it ('Should be false for string_value', () => {
            assert.strictEqual(Datetime.not("string_value"), false);
        })
        it ('Should be false for 100', () => {
            assert.strictEqual(Datetime.not(100), false);
        })
    });
})