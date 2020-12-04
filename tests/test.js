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

    describe('utc()', () => {
        it ('The utcMode Should be true', () => {
            assert.equal(datetime().utc().utcMode, true);
        })
    });

    describe('local()', () => {
        it ('The utcMode Should be false', () => {
            assert.equal(datetime().local().utcMode, false);
        })
    });

    describe('uselocale()', () => {
        it ('The locale Should be ru', () => {
            assert.equal(datetime().useLocale('ru').locale, 'ru');
        })
    });

    describe('same()', () => {
        it ('The Should be true', () => {
            assert.equal(datetime("2020").same("2020"), true);
        })
        it ('The Should be false', () => {
            assert.equal(datetime("2020").same("2021"), false);
        })
    });

    describe('isValid()', () => {
        it ('The Should be true for 2020-12-21', () => {
            assert.equal(datetime("2020-12-21").isValid(), true);
        })
        it ('The Should be false for 2020-21-12', () => {
            assert.equal(datetime("2020-21-12").isValid(), false);
        })
        it ('The Should be false for ABCD', () => {
            assert.equal(datetime("ABCD").isValid(), false);
        })
    });

    describe('isLeapYear()', () => {
        it ('Should be true for 2020', () => {
            assert.equal(datetime("2020").isLeapYear(), true);
        })
        it ('Should be false for 2021', () => {
            assert.equal(datetime("2021").isLeapYear(), false);
        })
    });

    describe('isToday()', () => {
        it ('Should be true for 2020-12-21 and 2020-12-21', () => {
            assert.equal(datetime("2020-12-21").isToday("2020-12-21"), true);
        })
        it ('Should be false for 2020-12-21 and 2020-12-22', () => {
            assert.equal(datetime("2020-12-21").isToday("2020-12-22"), false);
        })
    });

    describe('isYesterday()', () => {
        it ('Should be true for 2020-12-21 and 2020-12-20', () => {
            assert.equal(datetime("2020-12-21").isYesterday("2020-12-20"), true);
        })
        it ('Should be false for 2020-12-21 and 2020-12-22', () => {
            assert.equal(datetime("2020-12-21").isYesterday("2020-12-22"), false);
        })
    });

    describe('isTomorrow()', () => {
        it ('Should be true for 2020-12-21 and 2020-12-22', () => {
            assert.equal(datetime("2020-12-21").isTomorrow("2020-12-22"), true);
        })
        it ('Should be false for 2020-12-21 and 2020-12-20', () => {
            assert.equal(datetime("2020-12-21").isTomorrow("2020-12-20"), false);
        })
    });

    describe('year2()', () => {
        it ('Should be 21 for 2021', () => {
            assert.equal(datetime("2021").year2(), 21);
        })
    });

    describe('century()', () => {
        it ('Should be 20 for 2021', () => {
            assert.equal(datetime("2021").century(), 20);
        })
    });

    describe('dayOfYear()', () => {
        it ('Should be 356 for 2020-12-21', () => {
            assert.equal(datetime("2020-12-21").dayOfYear(), 356);
        })
    });

    describe('ampm()', () => {
        it ('Should be PM for 2020 20:00', () => {
            assert.equal(datetime("2020 20:00").ampm(), "PM");
        })
        it ('Should be am for 2020 10:00 and true for second argument', () => {
            assert.equal(datetime("2020 10:00").ampm(true), "am");
        })
    });

    describe('val()', () => {
        it ('Should be true for datetime(2020).val().getTime() === new Date(2020).getTime()', () => {
            assert.equal(datetime("2020").val().getTime() === new Date("2020").getTime(), true);
        })
        it ('Should be true for datetime().val(new Date("2021")).val().getTime() === new Date(2021).getTime()', () => {
            assert.equal(datetime().val(new Date("2021")).val().getTime() === new Date("2021").getTime(), true);
        })
    });

    describe('unix()', () => {
        it ('Should be true for datetime(2020).unix() === new Date(2020).getTime() / 1000', () => {
            assert.equal(datetime("2020").unix() === new Date("2020").getTime() / 1000, true);
        })
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