let assert = require('assert');
let chai = require('chai');
let expect = chai.expect;
require('../build/datetime.all.js');

describe('Datetime', function(){

    describe('new Datetime()', () => {
        it ('Should return a instance of Datetime ', () => {
            assert.strictEqual(new Datetime() instanceof Datetime, true);
        });
    });

    describe('Factory datetime()', () => {
        it ('should return a instance of Datetime ', () => {
            assert.strictEqual(datetime() instanceof Datetime, true);
        });
        it ('should return a instance of Datetime for null', () => {
            assert.strictEqual(datetime(null) instanceof Datetime, true);
        });
        it ('should return a instance fo Datetime for 2020-12-21', () => {
            assert.strictEqual(datetime('2020-12-21') instanceof Datetime, true);
        });
        it ('should return a instance fo Datetime for 2020-12-21 00:00:00', () => {
            assert.strictEqual(datetime('2020-12-21 00:00:00') instanceof Datetime, true);
        });
        it ('should return a instance fo Datetime for 2020-12', () => {
            assert.strictEqual(datetime("2020-12") instanceof Datetime, true);
        });
        it ('should return a instance fo Datetime for 2020', () => {
            assert.strictEqual(datetime(2020) instanceof Datetime, true);
        });
        it ('should return a instance fo Datetime for 2020, 12, 21', () => {
            assert.strictEqual(datetime(2020, 12, 21) instanceof Datetime, true);
        });
        it ('should return a instance fo Datetime for [2020, 12, 21]', () => {
            assert.strictEqual(datetime([2020, 12, 21]) instanceof Datetime, true);
        });
        it ('should throw error for 21-12-1972', () => {
            expect(() => {datetime("21-12-1972")}).to.throw(Datetime.INVALID_DATE);
        });
        it ('should throw error for ***', () => {
            expect(() => {datetime("***")}).to.throw(Datetime.INVALID_DATE);
        });
        it ('should throw error for undefined', () => {
            expect(() => {datetime(undefined)}).to.throw(Datetime.INVALID_DATE);
        });
    });

    describe('immutable()', () => {
        it ('The mutable Should be false', () => {
            assert.strictEqual(datetime().immutable().mutable, false);
        })
        it ('The mutable Should be true', () => {
            assert.strictEqual(datetime().immutable(false).mutable, true);
        })
        it ('The mutable Should be false', () => {
            var date = datetime().immutable();
            assert.strictEqual(date.addDay(1) === date, false);
        })
        it ('The mutable Should be true', () => {
            var date = datetime().immutable(false);
            assert.strictEqual(date.addDay(1) === date, true);
        })
        it ('The mutable Should be true', () => {
            var date = datetime();
            assert.strictEqual(date.addDay(1) === date, true);
        })
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

    describe('clone()', () => {
        it ('The Should be false', () => {
            var date = datetime();
            assert.strictEqual(date === date.clone(), false);
        })
        it ('The Should be true', () => {
            var date = datetime();
            var clone = date.clone();
            assert.strictEqual(date.locale === clone.locale && date.time() === clone.time(), true);
        })
    });

    describe('Align date', () => {

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