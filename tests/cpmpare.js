let assert = require('assert');

require('../src/index');
require('../src/plugins/compare');

describe('Datetime', function() {
    describe('older()', () => {
        it ('Should be true', () => {
            assert.strictEqual(datetime("2020").older("2021"), true);
        })
        it ('Should be false', () => {
            assert.strictEqual(datetime("2020").older("2019"), false);
        })
    });

    describe('younger()', () => {
        it ('Should be true', () => {
            assert.strictEqual(datetime("2020").younger("2019"), true);
        })
        it ('Should be false', () => {
            assert.strictEqual(datetime("2020").younger("2021"), false);
        })
    });

    describe('between()', () => {
        it ('Should be true', () => {
            assert.strictEqual(datetime("2020").between("2019", "2021"), true);
        })
    });

    describe('same()', () => {
        it ('The Should be true', () => {
            assert.strictEqual(datetime("2020").same("2020"), true);
        })
        it ('The Should be false', () => {
            assert.strictEqual(datetime("2020").same("2021"), false);
        })
    });

})