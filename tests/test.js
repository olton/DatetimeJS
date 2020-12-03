let assert = require('assert');
require('../build/datetime');

describe('Datetime', function(){

    describe('Factory datetime()', () => {
        it ('should return a instance of Datetime ', () => {
            assert.equal(datetime() instanceof Datetime, true);
        });
        it ('Invalid date', () => {
            assert.equal(datetime("21/12/1972").isValid(), false);
        });
    });

    describe('older()', () => {
        it ('Should be true', () => {
            assert.equal(datetime("2020").older("2021"), true);
        })
        it ('Should be false', () => {
            assert.equal(datetime("2020").older("2019"), false);
        })
    });

    describe('younger()', () => {
        it ('Should be true', () => {
            assert.equal(datetime("2020").younger("2019"), true);
        })
        it ('Should be false', () => {
            assert.equal(datetime("2020").younger("2021"), false);
        })
    });

    describe('between()', () => {
        it ('Should be true', () => {
            assert.equal(datetime("2020").between("2019", "2021"), true);
        })
    });

});