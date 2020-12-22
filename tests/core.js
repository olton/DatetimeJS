let assert = require('assert');
let chai = require('chai');
let expect = chai.expect;

require('../src/index.js');
require('../src/i18n/ru.js');

describe('Datetime', function(){

    describe('Datetime static methods', () => {
        it ('isDatetime() should be true', () => {
            assert.strictEqual(Datetime.isDatetime(datetime()), true);
        });
        it ('now() should be true', () => {
            assert.strictEqual(Datetime.align(Datetime.now(), 'day').time() === datetime().align('day').time(), true);
        });
        it ('now() should be true', () => {
            assert.strictEqual(Datetime.now(true) instanceof Date, true);
        });
        it ('getLocale() should be true', () => {
            assert.strictEqual(Datetime.getLocale('ru').months[0] === "Январь", true);
        });
        it ('getLocale() should be true', () => {
            assert.strictEqual(Datetime.getLocale('xx').months[0] === "January", true);
        });
        it ('getLocale() should be true', () => {
            assert.strictEqual(Datetime.getLocale().months[0] === "January", true);
        });
        it ('parse() should be true', () => {
            assert.strictEqual(Datetime.parse('Mon, 25 Dec 1995 13:30:00 GMT') instanceof Datetime, true);
        });
    });

    describe('new Datetime()', () => {
        it ('Should return a instance of Datetime ', () => {
            assert.strictEqual(new Datetime() instanceof Datetime, true);
        });
    });

    describe('Factory datetime()', () => {
        it ('should return a instance of Datetime ', () => {
            assert.strictEqual(datetime() instanceof Datetime, true);
        });
        it ('should return a instance of Datetime for Datetime', () => {
            assert.strictEqual(datetime(datetime()) instanceof Datetime, true);
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
        it ('The locale Should be en for xx', () => {
            assert.strictEqual(datetime().useLocale('xx').locale, 'en');
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

    describe('Align date to start of', () => {
        it ('Align to start of year', () => {
            assert.strictEqual(Datetime.align("2020-03-15 09:33:56", "year").format("YYYY-MM-DD HH:mm:ss"), "2020-01-01 00:00:00");
        });
        it ('Align to start of year', () => {
            assert.strictEqual(datetime("2020-03-15 09:33:56").align("year").format("YYYY-MM-DD HH:mm:ss"), "2020-01-01 00:00:00");
        });
        it ('Align to start of month', () => {
            assert.strictEqual(datetime("2020-03-15 09:33:56").align("month").format("YYYY-MM-DD HH:mm:ss"), "2020-03-01 00:00:00");
        });
        it ('Align to start of day', () => {
            assert.strictEqual(datetime("2020-03-15 09:33:56").align("day").format("YYYY-MM-DD HH:mm:ss"), "2020-03-15 00:00:00");
        });
        it ('Align to start of hour', () => {
            assert.strictEqual(datetime("2020-03-15 09:33:56").align("hour").format("YYYY-MM-DD HH:mm:ss"), "2020-03-15 09:00:00");
        });
        it ('Align to start of minute', () => {
            assert.strictEqual(datetime("2020-03-15 09:33:56").align("minute").format("YYYY-MM-DD HH:mm:ss"), "2020-03-15 09:33:00");
        });
        it ('Align to start of second', () => {
            assert.strictEqual(datetime("2020-03-15 09:33:56").align("second").format("YYYY-MM-DD HH:mm:ss.sss"), "2020-03-15 09:33:56.000");
        });
        it ('Align to start of week', () => {
            assert.strictEqual(datetime("2020-03-14 09:33:56").align("week").format("YYYY-MM-DD HH:mm:ss.sss"), "2020-03-08 00:00:00.000");
        });
        it ('Align to start of year', () => {
            assert.strictEqual(datetime("2020-03-15 09:33:56").immutable().align("year").format("YYYY-MM-DD HH:mm:ss"), "2020-01-01 00:00:00");
        });
    });

    describe('Align date to end of', () => {
        it ('Align to end of year', () => {
            assert.strictEqual(Datetime.alignEnd("2020-03-15 09:33:56", "year").format("YYYY-MM-DD HH:mm:ss"), "2020-12-31 23:59:59");
        });
        it ('Align to end of year', () => {
            assert.strictEqual(datetime("2020-03-15 09:33:56").alignEnd("year").format("YYYY-MM-DD HH:mm:ss"), "2020-12-31 23:59:59");
        });
        it ('Align to end of month', () => {
            assert.strictEqual(datetime("2020-03-15 09:33:56").alignEnd("month").format("YYYY-MM-DD HH:mm:ss"), "2020-03-31 23:59:59");
        });
        it ('Align to end of day', () => {
            assert.strictEqual(datetime("2020-03-15 09:33:56").alignEnd("day").format("YYYY-MM-DD HH:mm:ss"), "2020-03-15 23:59:59");
        });
        it ('Align to end of hour', () => {
            assert.strictEqual(datetime("2020-03-15 09:33:56").alignEnd("hour").format("YYYY-MM-DD HH:mm:ss"), "2020-03-15 09:59:59");
        });
        it ('Align to end of minute', () => {
            assert.strictEqual(datetime("2020-03-15 09:33:56").alignEnd("minute").format("YYYY-MM-DD HH:mm:ss"), "2020-03-15 09:33:59");
        });
        it ('Align to end of second', () => {
            assert.strictEqual(datetime("2020-03-15 09:33:56.777").alignEnd("minute").format("YYYY-MM-DD HH:mm:ss.sss"), "2020-03-15 09:33:59.999");
        });
        it ('Align to end of week', () => {
            assert.strictEqual(datetime("2020-03-15 09:33:56").alignEnd("week").format("YYYY-MM-DD HH:mm:ss"), "2020-03-21 23:59:59");
        });
        it ('Align to unknown', () => {
            assert.strictEqual(datetime("2020-03-15 09:33:56").alignEnd("xxx").format("YYYY-MM-DD HH:mm:ss"), "2020-03-15 09:33:56");
        });
        it ('Align to end of year', () => {
            assert.strictEqual(datetime("2020-03-15 09:33:56").immutable().alignEnd("year").format("YYYY-MM-DD HH:mm:ss"), "2020-12-31 23:59:59");
        });
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
        it ('Should be true', () => {
            assert.strictEqual(datetime().val(new Date("2021"))  instanceof Datetime, true);
        })
        it ('Should be true', () => {
            assert.strictEqual(datetime().immutable().val(new Date("2021"))  instanceof Datetime, true);
        })
    });

    describe('Getters get() and others', () => {
        it ('Should be 21 for 2021', () => {
            assert.strictEqual(datetime("2021").get('year'), 2021);
        })
        it ('Should be 2 for 2021-03', () => {
            assert.strictEqual(datetime("2021-03").get('month'), 2);
        })
        it ('Should be 15 for 2021-03-15', () => {
            assert.strictEqual(datetime("2021-03-15").get('day'), 15);
        })
        it ('Should be 1 for 2021-03-15', () => {
            assert.strictEqual(datetime("2021-03-15").get('weekDay'), 1);
        })
        it ('Should be 13', () => {
            assert.strictEqual(datetime("2021-03-15 13:15:34").get('hour'), 13);
        })
        it ('Should be 15 for 2021-03-15', () => {
            assert.strictEqual(datetime("2021-03-15 13:15:34").get('minute'), 15);
        })
        it ('Should be 15 for 2021-03-15', () => {
            assert.strictEqual(datetime("2021-03-15 13:15:34").get('second'), 34);
        })
        it ('Should be 15 for 2021-03-15', () => {
            assert.strictEqual(datetime("2021-03-15 13:15:34.243").get('ms'), 243);
        })
        it ('Should be 15 for 2021-03-15', () => {
            assert.strictEqual(datetime("2021-03-15 13:15:34.243").get('time'), 1615806934243);
        })
        it ('Should be 21 for 2021', () => {
            assert.strictEqual(datetime("2021").utc().get('year'), 2021);
        })
        it ('Should be 2 for 2021-03', () => {
            assert.strictEqual(datetime("2021-03").utc().get('month'), 2);
        })
        it ('Should be 15 for 2021-03-15', () => {
            assert.strictEqual(datetime("2021-03-15").utc().get('day'), 15);
        })
        it ('Should be 1 for 2021-03-15', () => {
            assert.strictEqual(datetime("2021-03-15").utc().get('weekDay'), 1);
        })
        it ('Should be 13', () => {
            assert.strictEqual(datetime("2021-03-15 13:15:34").utc().get('hour'), 11);
        })
        it ('Should be 15 for 2021-03-15', () => {
            assert.strictEqual(datetime("2021-03-15 13:15:34").utc().get('minute'), 15);
        })
        it ('Should be 15 for 2021-03-15', () => {
            assert.strictEqual(datetime("2021-03-15 13:15:34").utc().get('second'), 34);
        })
        it ('Should be 15 for 2021-03-15', () => {
            assert.strictEqual(datetime("2021-03-15 13:15:34.243").utc().get('ms'), 243);
        })
        it ('Should be 15 for 2021-03-15', () => {
            assert.strictEqual(datetime("2021-03-15 13:15:34.243").utc().get('time'), 1615806934243);
        })
        it ('Should be 15 for 2021-03-15', () => {
            assert.strictEqual(datetime("2021-03-15 13:15:34.243").immutable().get('time'), 1615806934243);
        })
        it ('Should be 15 for 2021-03-15', () => {
            assert.strictEqual(datetime("2021-03-15 13:15:34.243").get('xxx') instanceof Datetime, true);
        })
    });

    describe("Named getters", () => {
        it ('Should be 15 for 2021-03-15', () => {
            assert.strictEqual(datetime("2021-03-15 13:15:34.243").ms(), 243);
        })
        it ('Should be 15 for 2021-03-15', () => {
            assert.strictEqual(datetime("2021-03-15 13:15:34.243").second(), 34);
        })
        it ('Should be 15 for 2021-03-15', () => {
            assert.strictEqual(datetime("2021-03-15 13:15:34.243").minute(), 15);
        })
        it ('Should be 15 for 2021-03-15', () => {
            assert.strictEqual(datetime("2021-03-15 13:15:34.243").hour(), 13);
        })
        it ('Should be 15 for 2021-03-15', () => {
            assert.strictEqual(datetime("2021-03-15 13:15:34.243").day(), 15);
        })
        it ('Should be 15 for 2021-03-15', () => {
            assert.strictEqual(datetime("2021-03-15 13:15:34.243").weekDay(), 1);
        })
        it ('Should be 15 for 2021-03-15', () => {
            assert.strictEqual(datetime("2021-03-15 13:15:34.243").weekDay(null), 1);
        })
        it ('Should be 15 for 2021-03-15', () => {
            assert.strictEqual(datetime("2021-03-15 13:15:34.243").month(), 2);
        })
        it ('Should be 15 for 2021-03-15', () => {
            assert.strictEqual(datetime("2021-03-15 13:15:34.243").year(), 2021);
        })
    });

    describe('Setters set() and others', () => {
        it ('Should be 22', () => {
            assert.strictEqual(datetime("2021").set('year', 2022).year(), 2022);
        })
        it ('Should be 3', () => {
            assert.strictEqual(datetime("2021-03").set('month', 3).month(), 3);
        })
        it ('Should be 22', () => {
            assert.strictEqual(datetime("2021-03-15").set('day', 22).day(), 22);
        })
        it ('Should be 1 for 2021-03-15', () => {
            assert.strictEqual(datetime("2021-03-15").set('weekDay', 2).weekDay(), 2);
        })
        it ('Should be 10', () => {
            assert.strictEqual(datetime("2021-03-15 13:15:34").set('hour', 10).hour(), 10);
        })
        it ('Should be 10', () => {
            assert.strictEqual(datetime("2021-03-15 13:15:34").set('minute', 10).minute(), 10);
        })
        it ('Should be 10', () => {
            assert.strictEqual(datetime("2021-03-15 13:15:34").set('second', 10).second(), 10);
        })
        it ('Should be 222', () => {
            assert.strictEqual(datetime("2021-03-15 13:15:34.243").set('ms', 222).ms(), 222);
        })
        it ('Should be 1615806934244', () => {
            assert.strictEqual(datetime("2021-03-15 13:15:34.243").set('time', 1615806934244).time(), 1615806934244);
        })
        it ('Should be 2022', () => {
            assert.strictEqual(datetime("2021").utc().set('year', 2022).year(), 2022);
        })
        it ('Should be 3', () => {
            assert.strictEqual(datetime("2021-03").utc().set('month', 3).month(), 3);
        })
        it ('Should be 10', () => {
            assert.strictEqual(datetime("2021-03-15").utc().set('day', 10).day(), 10);
        })
        it ('Should be 1 for 2021-03-15', () => {
            assert.strictEqual(datetime("2021-03-15").utc().set('weekDay', 2).weekDay(), 2);
        })
        it ('Should be 11', () => {
            assert.strictEqual(datetime("2021-03-15 13:15:34").utc().set('hour', 11).hour(), 11);
        })
        it ('Should be 20', () => {
            assert.strictEqual(datetime("2021-03-15 13:15:34").utc().set('minute', 20).minute(), 20);
        })
        it ('Should be 15', () => {
            assert.strictEqual(datetime("2021-03-15 13:15:34").utc().set('second', 15).second(), 15);
        })
        it ('Should be 222', () => {
            assert.strictEqual(datetime("2021-03-15 13:15:34.243").utc().set('ms', 222).ms(), 222);
        })
        it ('Should be 1615806934244', () => {
            assert.strictEqual(datetime("2021-03-15 13:15:34.243").utc().set('time', 1615806934244).time(), 1615806934244);
        })
        it ('Should be 1615806934244', () => {
            assert.strictEqual(datetime("2021-03-15 13:15:34.243").immutable().set('time', 1615806934244).time(), 1615806934244);
        })
        it ('Should be 1615806934243', () => {
            assert.strictEqual(datetime("2021-03-15 13:15:34.243").immutable().set('zzz', 1615806934244).time(), 1615806934243);
        })
    });

    describe('add functions', () => {
        it("default, should be 2021", () => {
            assert.strictEqual(datetime("2020").year(), 2020);
            assert.strictEqual(datetime("2020").add(1, 'year').year(), 2021);
        })
        it("default, should be 1", () => {
            assert.strictEqual(datetime("2020").month(), 0);
            assert.strictEqual(datetime("2020").add(1, 'month').month(), 1);
        })
        it("default, should be 2", () => {
            assert.strictEqual(datetime("2020").day(), 1);
            assert.strictEqual(datetime("2020").add(1, 'day').day(), 2);
        })
        it("default, should be 1", () => {
            assert.strictEqual(datetime("2020-1").hour(), 0);
            assert.strictEqual(datetime("2020-1").add(1, 'hour').hour(), 1);
        })
        it("default, should be 1", () => {
            assert.strictEqual(datetime("2020-1").minute(), 0);
            assert.strictEqual(datetime("2020-1").add(1, 'minute').minute(), 1);
        })
        it("default, should be 1", () => {
            assert.strictEqual(datetime("2020-1").second(), 0);
            assert.strictEqual(datetime("2020-1").add(1, 'second').second(), 1);
        })
        it("default, should be 1", () => {
            assert.strictEqual(datetime("2020-1").ms(), 0);
            assert.strictEqual(datetime("2020-1").add(1, 'ms').ms(), 1);
        })
        it("default, should be 1", () => {
            assert.strictEqual(datetime("2020-1").day(), 1);
            assert.strictEqual(datetime("2020-1").add(1, 'week').day(), 8);
        })

        it("default, should be 2021", () => {
            assert.strictEqual(datetime("2020").year(), 2020);
            assert.strictEqual(datetime("2020").addYear(1).year(), 2021);
        })
        it("default, should be 1", () => {
            assert.strictEqual(datetime("2020").month(), 0);
            assert.strictEqual(datetime("2020").addMonth(1).month(), 1);
        })
        it("default, should be 2", () => {
            assert.strictEqual(datetime("2020").day(), 1);
            assert.strictEqual(datetime("2020").addDay(1).day(), 2);
        })
        it("default, should be 1", () => {
            assert.strictEqual(datetime("2020-1").hour(), 0);
            assert.strictEqual(datetime("2020-1").addHour(1).hour(), 1);
        })
        it("default, should be 1", () => {
            assert.strictEqual(datetime("2020-1").minute(), 0);
            assert.strictEqual(datetime("2020-1").addMinute(1).minute(), 1);
        })
        it("default, should be 1", () => {
            assert.strictEqual(datetime("2020-1").second(), 0);
            assert.strictEqual(datetime("2020-1").addSecond(1).second(), 1);
        })
        it("default, should be 1", () => {
            assert.strictEqual(datetime("2020-1").ms(), 0);
            assert.strictEqual(datetime("2020-1").addMs(1).ms(), 1);
        })
        it("default, should be 1", () => {
            assert.strictEqual(datetime("2020-1").day(), 1);
            assert.strictEqual(datetime("2020-1").addWeek(1).day(), 8);
        })
    });

    describe('format()', () => {
        it("default, should be ", () => {
            assert.strictEqual(datetime("2020").format(), '2020-01-01T02:00:00.000');
        })
    });

    describe('toString()', () => {
        it("", () => {
            assert.strictEqual(datetime("2020").toString(), 'Wed Jan 01 2020 02:00:00 GMT+0200 (GMT+02:00)');
        })
    });

    describe('valueOf()', () => {
        it("", () => {
            assert.strictEqual(datetime("2020").valueOf(), 1577836800000);
        })
    });
});