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

    describe('', () => {

    });

});