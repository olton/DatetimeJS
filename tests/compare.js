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

    describe('equal()', () => {
        it ('The Should be true', () => {
            assert.strictEqual(datetime("2020").equal("2020"), true);
        })
        it ('The Should be false', () => {
            assert.strictEqual(datetime("2020").equal("2021"), false);
        })
        it ('The Should be false', () => {
            assert.strictEqual(datetime("2020-1").equal("2020-2"), false);
        })
    });

    describe('notEqual()', () => {
        it ('The Should be true', () => {
            assert.strictEqual(datetime("2020").notEqual("2021"), true);
        })
        it ('The Should be false', () => {
            assert.strictEqual(datetime("2020").notEqual("2020"), false);
        })
        it ('The Should be false', () => {
            assert.strictEqual(datetime("2020-1").notEqual("2020-2"), true);
        })
    });

    describe('olderOrEqual()', () => {
        it ('The Should be true', () => {
            assert.strictEqual(datetime("2020").olderOrEqual("2021"), true);
        })
        it ('The Should be true', () => {
            assert.strictEqual(datetime("2020").olderOrEqual("2020"), true);
        })
        it ('The Should be false', () => {
            assert.strictEqual(datetime("2020").olderOrEqual("2019"), false);
        })
    });

    describe('youngerOrEqual()', () => {
        it ('The Should be true', () => {
            assert.strictEqual(datetime("2020").youngerOrEqual("2019"), true);
        })
        it ('The Should be true', () => {
            assert.strictEqual(datetime("2020").youngerOrEqual("2020"), true);
        })
        it ('The Should be false', () => {
            assert.strictEqual(datetime("2020").youngerOrEqual("2021"), false);
        })
    });

    describe('compare()', () => {
        it ('The Should be false', () => {
            assert.strictEqual(datetime("2020").compare("2019", "year", "x"), false);
        })
        it ('The Should be false', () => {
            assert.strictEqual(datetime("2020").compare("2019", "year", null), false);
        })
    });

    describe('diff()', () => {
        it ('The Should be 1', () => {
            assert.strictEqual(datetime("2020").diff("2019").year, 1);
        })
        it ('The Should be 1', () => {
            assert.strictEqual(datetime("2020").distance("2019", "year"), 1);
        })
    });

})