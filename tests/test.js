let assert = require('assert');
require('../build/datetime.all.js');

describe('Datetime', function(){

    describe('new Datetime', () => {
        it ('Should return a instance of Datetime ', () => {
            assert.strictEqual(new Datetime() instanceof Datetime, true);
        });
    });

    describe('Factory datetime()', () => {
        it ('should return a instance of Datetime ', () => {
            assert.strictEqual(datetime() instanceof Datetime, true);
        });
        it ('Invalid date', () => {
            assert.strictEqual(datetime("21/12/1972").isValid(), false);
        });
    });

    describe('utc()', () => {
        it ('The utcMode Should be true', () => {
            assert.strictEqual(datetime().utc().utcMode, true);
        })
    });

    describe('local()', () => {
        it ('The utcMode Should be false', () => {
            assert.strictEqual(datetime().local().utcMode, false);
        })
    });

    describe('uselocale()', () => {
        it ('The locale Should be ru', () => {
            assert.strictEqual(datetime().useLocale('ru').locale, 'ru');
        })
    });

    describe('isValid()', () => {
        it ('The Should be true for 2020-12-21', () => {
            assert.strictEqual(datetime("2020-12-21").isValid(), true);
        })
        it ('The Should be false for 2020-21-12', () => {
            assert.strictEqual(datetime("2020-21-12").isValid(), false);
        })
        it ('The Should be false for ABCD', () => {
            assert.strictEqual(datetime("ABCD").isValid(), false);
        })
    });

    describe('year2()', () => {
        it ('Should be 21 for 2021', () => {
            assert.strictEqual(datetime("2021").year2(), 21);
        })
    });

    describe('val()', () => {
        it ('Should be true for datetime(2020).val().getTime() === new Date(2020).getTime()', () => {
            assert.strictEqual(datetime("2020").val().getTime() === new Date("2020").getTime(), true);
        })
        it ('Should be true for datetime().val(new Date("2021")).val().getTime() === new Date(2021).getTime()', () => {
            assert.strictEqual(datetime().val(new Date("2021")).val().getTime() === new Date("2021").getTime(), true);
        })
    });


});