/*
 * Datetime v1.0.0, (https://github.com/olton/Datetime.git)
 * Copyright 2020 by Serhii Pimenov
 * Datetime.js is a minimalist JavaScript library that parses, validates, manipulates, and displays dates and times for modern browsers with comfortable modern API.
 * Build at 10/12/2020 14:57:26
 * Licensed under MIT
 */


// Source: src/index.js

/* global global*/
(function(global) {
    'use strict';

    var DEFAULT_FORMAT = "YYYY-MM-DDTHH:mm:ss.sssZ";
    var INVALID_DATE = "Invalid date";
    var REGEX_FORMAT = /\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,3}|Z{1,2}|z{1,2}|C|W{1,2}|I{1,3}|B{2,4}|(^[T][a-zA-Z]{1,4})/g;

    global['DATETIME_LOCALES'] = {
        "en": {
            months: "January February March April May June July August September October November December".split(" "),
            monthsShort: "Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" "),
            weekdays: "Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" "),
            weekdaysShort: "Sun Mon Tue Wed Thu Fri Sat".split(" "),
            weekdaysMin: "Su Mo Tu We Th Fr Sa".split(" "),
            weekStart: 0
        }
    }

    var M = {
        ms: "Milliseconds",
        s: "Seconds",
        m: "Minutes",
        h: "Hours",
        D: "Date",
        d: "Day",
        M: "Month",
        Y: "FullYear",
        y: "Year",
        t: "Time"
    }

    var C = {
        ms: "millisecond",
        s: "second",
        m: "minute",
        h: "hour",
        D: "day",
        W: "week",
        WI: "isoWeek",
        d: "weekDay",
        dI: "isoWeekDay",
        M: "month",
        Y: "year",
        Y2: "year2",
        t: "time",
        c: "century",
        q: "quarter"
    }

    // *** This polyfill only for IE, and must be removed after the end of support IE ***
    if (typeof Object.values !== "function") {
        Object.prototype.values = function(){
            var self = this;
            Object.keys(self).map(function(e) {
                return self[e];
            });
        }
    }
    // ******************* end of polyfill **********************************************

    var lpad = function(str, pad, length){
        var _str = ""+str;
        if (length && _str.length >= length) {
            return _str;
        }
        return Array((length + 1) - _str.length).join(pad) + _str;
    }

    var not = function(v){
        return typeof v === "undefined" || v === null;
    }

    /* Fabric method */
    var datetime = function(){
        var args;
        if (arguments[0] instanceof Datetime) {
            return arguments[0].clone();
        }
        if (Array.isArray(arguments[0])) {
            args = [].slice.call(arguments[0]);
        } else {
            args = [].slice.call(arguments);
        }
        return new (Function.prototype.bind.apply(Datetime,  [this].concat(args) ) );
    }

    /* Main class */
    var Datetime = function(){
        var args = [].slice.call(arguments);
        this.value = new (Function.prototype.bind.apply(Date,  [this].concat(args) ) );
        this.locale = "en";
        this.weekStart = global['DATETIME_LOCALES']["en"].weekStart;
        this.utcMode = false;
        this.mutable = true;
    }

    /* ************ Static methods **************** */
    Datetime.DEFAULT_FORMAT = DEFAULT_FORMAT;
    Datetime.REGEX_FORMAT = REGEX_FORMAT;
    Datetime.INVALID_DATE = INVALID_DATE;

    Datetime.lpad = lpad;
    Datetime.not = not;

    Datetime.isDatetime = function(val){
        return val instanceof Datetime;
    }

    Datetime.now = function(asDate){
        return asDate ? datetime().val() : datetime().time();
    }

    Datetime.locale = function(name, locale){
        global['DATETIME_LOCALES'][name] = locale;
    }

    Datetime.getNames = function(locale){
        return global['DATETIME_LOCALES'][locale || "en"];
    }

    Datetime.parse = function(str){
        return datetime(Date.parse(str));
    }

    /* Plugin support */
    Datetime.extend = function(where){
        var options, name,
            length = arguments.length;

        for (var i = 1; i < length; i++ ) {
            if ( ( options = arguments[ i ] ) != null ) {
                for ( name in options ) {
                    if (Object.prototype.hasOwnProperty.call(options, name))
                        where[ name ] = options[ name ];
                }
            }
        }

        return where;
    };

    Datetime.use = function(obj){
        Datetime.extend(Datetime.prototype, obj);
    }

    Datetime.useStatic = function(obj){
        Datetime.extend(Datetime, obj);
    }
    /* ************* End of static **************** */

    Datetime.prototype = {
        immutable: function(v){
            this.mutable = !(not(v) ? true : v);
            return this;
        },

        utc: function(){
            this.utcMode = true;
            return this;
        },

        local: function(){
            this.utcMode = false
            return this;
        },

        useLocale: function(val){
            this.locale = val;
            return this;
        },

        clone: function(){
            var c = datetime(this.value);
            c.locale = this.locale;
            c.mutable = this.mutable;
            c.weekStart = this.weekStart;
            return c;
        },

        isValid: function(){
            return !isNaN(this.time());
        },

        val: function(val){
            if ( !(val instanceof Date) )
                return this.value;

            if (this.mutable) {
                this.value = val;
                return this;
            }

            return datetime(val);
        },

        valueOf: function(){
            return this.value.getTime();
        },

        /* Get + Set */

        _set: function(m, v){
            var fn = "set" + (this.utcMode && m !== "t" ? "UTC" : "") + M[m];
            if (this.mutable) {
                this.value[fn](v);
                return this;
            }
            var clone = this.clone();
            clone.value[fn](v);
            return clone;
        },

        _get: function(m){
            return this.value["get"+(this.utcMode && m !== "t" ? "UTC" : "")+M[m]]();
        },

        _work: function(part, val){
            if (!arguments.length || (typeof val === "undefined" || val === null)) {
                return this._get(part);
            }
            return this._set(part, val);
        },

        millisecond: function(val){ return this._work("ms", val);},
        ms: function(val){ return this._work("ms", val);},
        second: function(val){return this._work("s", val);},
        minute: function(val){return this._work("m", val); },
        hour: function(val){return this._work("h", val);},
        day: function(val){return this._work("D", val);},
        month: function(val){return this._work("M", val);},
        year: function(val){return this._work("Y", val);},
        time: function(val){return this._work("t", val);},

        weekDay: function(val){
            if (!arguments.length || (not(val))) {
                return this.utcMode ? this.value.getUTCDay() : this.value.getDay();
            }

            var curr = this.weekDay();
            var diff = curr - val;

            this.day(this.day() + diff);

            return this;
        },

        get: function(unit){
            return Object.values(C).indexOf(unit) === -1 ? this.valueOf() : this[unit]();
        },

        set: function(unit, val){
            return Object.values(C).indexOf(unit) === -1 ? this : this[unit]( val || 0 );
        },

        add: function(val, to){
            switch (to) {
                case C.h: return this.time(this.time() + (val * 60 * 60 * 1000));
                case C.m: return this.time(this.time() + (val * 60 * 1000));
                case C.s: return this.time(this.time() + (val * 1000));
                case C.ms: return this.time(this.time() + (val));
                case C.D: return this.day(this.day() + val);
                case C.W: return this.day(this.day() + val * 7);
                case C.M: return this.month(this.month() + val);
                case C.Y: return this.year(this.year() + val);
                case C.q: return this.month(this.month() + val * 3);
            }
        },

        addHour: function(v){return this.add(v,C.h);},
        addMinute: function(v){return this.add(v,C.m);},
        addSecond: function(v){return this.add(v, C.s);},
        addMillisecond: function(v){return this.add(v, C.ms);},
        addMs: function(v){return this.add(v, C.ms);},
        addDay: function(v){return this.add(v,C.D);},
        addWeek: function(v){return this.add(v,C.W);},
        addMonth: function(v){return this.add(v, C.M);},
        addYear: function(v){return this.add(v, C.Y);},
        addQuarter: function(v){return this.add(v, C.q);},

        format: function(fmt, locale){
            if (!this.isValid()) return INVALID_DATE;

            var format = fmt || DEFAULT_FORMAT;
            var names = Datetime.getNames(locale || this.locale);
            var year = this.year(), year2 = this.year2(), month = this.month(), day = this.day(), weekDay = this.weekDay(), weekNumber = this.weekNumber();
            var hour = this.hour(), hour12 = this.hour12(), minute = this.minute(), second = this.second(), ms = this.millisecond();
            var matches = {
                YY: year2,
                YYYY: year,
                M: month + 1,
                MM: lpad(month + 1, "0", 2),
                MMM: names.monthsShort[month],
                MMMM: names.months[month],
                D: day,
                DD: lpad(day, "0", 2),
                d: weekDay,
                dd: names.weekdaysMin[weekDay],
                ddd: names.weekdaysShort[weekDay],
                dddd: names.weekdays[weekDay],
                W: weekNumber,
                WW: lpad(weekNumber, "0", 2),
                H: hour,
                HH: lpad(hour, "0", 2),
                h: hour12,
                hh: lpad(hour12, "0", 2),
                a: this.ampm(true),
                A: this.ampm(false),
                m: minute,
                mm: lpad(minute,"0", 2),
                s: second,
                ss: lpad(second,"0", 2),
                sss: lpad(ms,"0", 3),
                Z: this.utcMode ? "Z" : this.timezone(),
                C: this.century(),
                I: this.isoWeekDay(),
                II: this.isoWeekNumber()
            };

            return format.replace(REGEX_FORMAT, function(match){
                return matches[match] || match;
            });
        },

        toTimeString: function(){
            return this.value.toTimeString();
        },

        toLocaleDateString: function(){
            return this.value.toLocaleDateString();
        },

        toLocaleString: function(){
            return this.value.toLocaleString();
        },

        toLocaleTimeString: function(){
            return this.value.toLocaleTimeString();
        },

        toString: function(){
            return this.value.toString();
        },

        toJSON: function(){
            return this.value.toJSON();
        },

        toSource: function(){
            return this.value.toSource();
        },

        toISOString: function(){
            return this.value.toISOString();
        },

        toUTCString: function(){
            return this.value.toUTCString();
        },

        toDate: function(){
            return new Date(this.valueOf());
        }
    }

    global.Datetime = Datetime;
    global.datetime = datetime;

}(typeof self === "undefined" ? typeof global === "undefined" ? window : global : self));


// Source: src/i18n/af.js

/* global Datetime */
Datetime.locale("af", {
    months: "Januarie Februarie Maart April Mei Junie Julie Augustus September Oktober November Desember".split(" "),
    monthsShort: "Jan Feb Mrt Apr Mei Jun Jul Aug Sep Okt Nov Des".split(" "),
    weekdays: "Sondag Maandag Dinsdag Woensdag Donderdag Vrydag Saterdag".split(" "),
    weekdaysShort: "Son Maa Din Woe Don Vry Sat".split(" "),
    weekdaysMin: "So Ma Di Wo Do Vr Sa".split(" "),
    weekStart: 1
});


// Source: src/i18n/de.js

/* global Datetime */
Datetime.locale("de", {
    months: "Januar Februar März April Mai Juni Juli August September Oktober November Dezember".split(" "),
    monthsShort: "Jan Feb Mär Apr Mai Jun Jul Aug Sep Okt Nov Dez".split(" "),
    weekdays: "Sonntag Montag Dienstag Mittwoch Donnerstag Freitag Samstag".split(" "),
    weekdaysShort: "Son Mon Die Mit Don Fre Sam".split(" "),
    weekdaysMin: "So Mo Di Mi Do Fr Sa".split(" "),
    weekStart: 1
});


// Source: src/i18n/ru.js

/* global Datetime */
Datetime.locale("ru", {
    months: "Январь Февраль Март Апрель Май Июнь Июль Август Сентябрь Октябрь Ноябрь Декабрь".split(" "),
    monthsParental: "Января Февраля Марта Апреля Мая Июня Июля Августа Сентября Октября Ноября Декабря".split(" "),
    monthsShort: "Янв Фев Мар Апр Май Июн Июл Авг Сен Окт Ноя Дек".split(" "),
    weekdays: "Воскресенье Понедельник Вторник Среда Четверг Пятница Суббота".split(" "),
    weekdaysShort: "Вск Пон Втр Срд Чет Пят Суб".split(" "),
    weekdaysMin: "Вс Пн Вт Ср Чт Пт Сб".split(" "),
    weekStart: 1
});


// Source: src/i18n/ua.js

/* global Datetime */
Datetime.locale("ua", {
    months: "Січень Лютий Березень Квітень Травень Червень Липень Серпень Вересень Жовтень Листопад Грудень".split(" "),
    monthsParental: "Січня Лютого Березеня Квітня Травня Червня Липня Серпня Вересня Жовтня Листопада Грудня".split(" "),
    monthsShort: "Січ Лют Бер Кві Тра Чер Лип Сер Вер Жов Лис Гру".split(" "),
    weekdays: "Неділя Понеділок Вівторок Середа Четвер П'ятниця Субота".split(" "),
    weekdaysShort: "Нед Пон Вів Сер Чет Птн Суб".split(" "),
    weekdaysMin: "Нд Пн Вт Ср Чт Пт Сб".split(" "),
    weekStart: 1
});


// Source: src/i18n/zh.js

/* global Datetime */
Datetime.locale("zh", {
    months: "一月 二月 三月 四月 五月 六月 七月 八月 九月 十月 十一月 十二月".split(" "),
    monthsShort: "1月 2月 3月 4月 5月 6月 7月 8月 9月 10月 11月 12月".split(" "),
    weekdays: "星期日 星期一 星期二 星期三 星期四 星期五 星期六".split(" "),
    weekdaysShort: "周日 周一 周二 周三 周四 周五 周六".split(" "),
    weekdaysMin: "日 一 二 三 四 五 六".split(" "),
    weekStart: 1
});


// Source: src/plugins/align.js

/* global Datetime, datetime */
(function() {
    'use strict';

    Datetime.useStatic({
        align: function(d, align, asDate){
            var date = datetime(d), result, temp;
            switch (align) {
                case "second":  result = date["millisecond"](0); break; //second
                case "minute":  result = date["millisecond"](0)["second"](0); break; //minute
                case "hour":  result = date["millisecond"](0)["second"](0)["minute"](0); break; //hour
                case "day":  result = date["millisecond"](0)["second"](0)["minute"](0)["hour"](0); break; //day
                case "month":  result = date["millisecond"](0)["second"](0)["minute"](0)["hour"](0)["day"](1); break; //month
                case "year":  result = date["millisecond"](0)["second"](0)["minute"](0)["hour"](0)["day"](1)["month"](0); break; //year
                case "quarter":  result = date["millisecond"](0)["second"](0)["minute"](0)["hour"](0)["day"](1)["month"](date.quarter() * 3 - 3); break; //quarter
                case "week":  {
                    temp = date.weekDay();
                    result = date["millisecond"](0)["second"](0)["minute"](0)["hour"](0).addDay(-temp);
                    break; // week
                }
                case "isoWeek": {
                    temp = date.weekDay();
                    result = date["millisecond"](0)["second"](0)["minute"](0)["hour"](0).addDay(-temp + 1);
                    break; // isoWeek
                }
                default:   result = date;
            }
            return asDate ? result.val() : result;
        }
    })

    Datetime.use({
        align: function(align){
            if (this.mutable) {
                this.value = Datetime.align(this.value, align, true);
                return this;
            }

            return this.clone().align(align);
        }
    })
}());


// Source: src/plugins/buddhist.js

/* global Datetime */
(function() {
    'use strict';

    var oldFormat = Datetime.prototype.format;

    Datetime.use({
        buddhist: function(){
            return this.year() + 543;
        },

        format: function(format, locale){
            format = format || Datetime.DEFAULT_FORMAT;
            var matches = {
                BB: (this.buddhist()+"").slice(-2),
                BBBB: this.buddhist()
            }
            var result = format.replace(/(\[[^\]]+])|B{4}|B{2}/g, function(match){
                return matches[match] || match;
            })
            return oldFormat.bind(this)(result, locale)
        }
    });
}());


// Source: src/plugins/calendar.js

/* global Datetime, datetime */
(function() {
    'use strict';

    Datetime.use({
        calendar: function(iso){
            return Datetime.calendar(this, iso);
        }
    });

    Datetime.useStatic({
        calendar: function(d, iso){
            var ws = iso ? 1 : 0;
            var date = d instanceof Datetime ? d.clone().align("month") : datetime(d);
            var wd = ws ? date.isoWeekDay() : date.weekDay();
            var names = Datetime.getNames(date.locale);

            var getWeekDays = function (wd, ws){
                if (ws === 0) {
                    return wd;
                }
                var su = wd[0];
                return wd.slice(1).concat([su]);
            }

            var result = {
                month: names.months[date.month()],
                days: [],
                weekStart: iso ? 1 : 0,
                weekDays: getWeekDays(names.weekdaysMin,ws),
                toDay: datetime().format("YYYY-MM-DD"),
                weekends: []
            };

            date.addDay(ws ? -wd+1 : -wd);

            for(var i = 0; i < 42; i++) {
                result.days.push(date.format("YYYY-MM-DD"));
                date.add(1, 'day');
            }

            result.weekends = result.days.filter(function(v, i){
                var def = [0,6,7,13,14,20,21,27,28,34,35,41];
                var iso = [5,6,12,13,19,20,26,27,33,34,40,41];

                return ws === 0 ? def.indexOf(i) > -1 : iso.indexOf(i) > -1;
            });

            return result;
        }
    });
}());


// Source: src/plugins/century.js

/* global Datetime */
(function() {
    'use strict';

    Datetime.use({
        century: function(){
            return parseInt(this.year() / 100);
        }
    })
}());


// Source: src/plugins/compare.js

/* global Datetime, datetime */
(function() {
    'use strict';

    Datetime.use({
        same: function(d){
            return this.time() === datetime(d).time();
        },

        /*
        * align: year, month, day, hour, minute, second, millisecond = default
        * */
        compare: function(d, align, operator){
            var date = datetime(d);
            var curr = this.clone();
            var t1, t2;

            operator = operator || "<";

            if (["<", ">", ">=", "<=", "=", "!="].indexOf(operator) === -1) {
                throw new Error("Operator must be one of <, >, >=, <=, =, !=");
            }

            if (!curr.isValid()) {
                throw new Error("Object has not contains a valid date");
            }

            if (!date.isValid()) {
                throw new Error("Argument is not a valid date");
            }

            align = (align || "millisecond").toLowerCase();

            t1 = curr.align(align).time();
            t2 = date.align(align).time();

            switch (operator) {
                case "<":
                    return t1 < t2;
                case ">":
                    return t1 > t2;
                case "<=":
                    return t1 <= t2;
                case ">=":
                    return t1 >= t2;
                case "=":
                    return t1 === t2;
                case "!=":
                    return t1 !== t2;
            }
        },

        between: function(d1, d2){
            return this.younger(d1) && this.older(d2);
        },

        older: function(date, align){
            return this.compare(date, align, "<");
        },

        olderOrEqual: function(date, align){
            return this.compare(date, align, "<=");
        },

        younger: function(date, align){
            return this.compare(date, align, ">");
        },

        youngerOrEqual: function(date, align){
            return this.compare(date, align, ">=");
        },

        equal: function(date, align){
            return this.compare(date, align, "=");
        },

        notEqual: function(date, align){
            return this.compare(date, align, "!=");
        },

        diff: function(d){
            var date = datetime(d);
            var diff = Math.abs(this.time() - date.time());
            var diffMonth = Math.abs(this.month() - date.month() + (12 * (this.year() - date.year())));

            return {
                "millisecond": diff,
                "second": Math.ceil(diff / 1000),
                "minute": Math.ceil(diff / (1000 * 60)),
                "hour": Math.ceil(diff / (1000 * 60 * 60)),
                "day": Math.ceil(diff / (1000 * 60 * 60 * 24)),
                "month": diffMonth,
                "year": Math.floor(diffMonth / 12)
            }
        },

        distance: function(d, align){
            return this.diff(d)[align];
        }
    })
}());


// Source: src/plugins/dayofyear.js

/* global Datetime */
/*
* Plugin required isleapyear.js
* */
(function() {
    'use strict';

    Datetime.use({
        dayOfYear: function(){
            var dayCount = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
            var month = this.month();
            var day = this.day();
            return dayCount[month] + day + ((month > 1 && this.isLeapYear()) ? 1 : 0);
        }
    })
}());


// Source: src/plugins/daysin.js

/* global Datetime */
(function() {
    'use strict';

    Datetime.use({
        daysInMonth: function(){
            var curr = this.clone();
            return curr.add(1, 'month').day(1).add(-1, 'day').day();
        },

        daysInYear: function(){
            return this.isLeapYear() ? 366 : 365;
        },

        daysInYearMap: function(){
            var result = [];
            var curr = this.clone();

            curr.month(0).day(1);

            for(var i = 0; i < 12; i++) {
                curr.add(1, 'month').add(-1, 'day');
                result.push(curr.day());
                curr.day(1).add(1, 'month');
            }
            return result;
        },

        daysInYearObj: function(locale, shortName){
            var map = this.daysInYearMap();
            var result = {};
            var names = Datetime.getNames(locale || this.locale);

            map.forEach(function(v, i){
                result[names[shortName ? 'monthsShort' : 'months'][i]] = v;
            });

            return result;
        }
    })
}());


// Source: src/plugins/hour12.js

/* global Datetime */
(function() {
    'use strict';

    Datetime.use({
        ampm: function(isLowerCase){
            var val = this.hour() < 12 ? "AM" : "PM";
            return isLowerCase ? val.toLowerCase() : val;
        },

        hour12: function(h, /* string am|pm */ p){
            var hour = h;

            if (arguments.length === 0) {
                return this.hour() % 12 || 12;
            }

            p = p || 'am';

            if (p.toLowerCase() === "pm") {
                hour += 12;
            }

            return this.hour(hour);
        }
    })
}());


// Source: src/plugins/isleapyear.js

/* global Datetime */
(function() {
    'use strict';

    Datetime.use({
        isLeapYear: function(){
            var year = this.year();
            return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
        }
    })
}());


// Source: src/plugins/iso.js

/* global Datetime */
(function() {
    'use strict';

    Datetime.use({
        isoWeekDay: function(val){
            if (!arguments.length || (Datetime.not(val))) {
                return (this.weekDay() + 6) % 7 + 1;
            }

            return this.weekDay((val + 6) % 7 + 1);
        },

        isoWeekNumber: function(){
            return this.weekNumber(1);
        }
    })
}());


// Source: src/plugins/parser.js

/* global Datetime, datetime */
(function() {
    'use strict';

    Datetime.useStatic({
        parseFromString: function(str, format, locale){
            var norm, normFormat, fItems, dItems;
            var iMonth, iDay, iYear, iHour, iMinute, iSecond;
            var year, month, day, hour, minute, second;
            var parsedMonth;

            var getIndex = function(where, what){
                return where.map(function(el){
                    return el.toLowerCase();
                }).indexOf(what.toLowerCase());
            }

            var monthNameToNumber = function(month){
                var i = -1;
                var names = Datetime.getNames(locale || 'en');

                if (Datetime.not(month)) return -1;

                i = getIndex(names.months, month);

                if (i === -1 && typeof names["monthsParental"] !== "undefined") {
                    i = getIndex(names.monthsParental, month);
                }

                if (i === -1) {
                    month = month.substr(0, 3);
                    i = getIndex(names.monthsShort, month);
                }

                return i === -1 ? -1 : i + 1;
            };

            var getPartIndex = function(part){
                var parts = {
                    "month": ["M", "mm", "%m"],
                    "day": ["D", "dd", "%d"],
                    "year": ["YY", "YYYY", "yy", "yyyy", "%y"],
                    "hour": ["h", "hh", "%h"],
                    "minute": ["m", "mi", "i", "ii", "%i"],
                    "second": ["s", "ss", "%s"]
                }

                var result = -1, key, index;

                if (!parts[part]) {
                    return result;
                }

                for(var i = 0; i < parts[part].length; i++) {
                    key = parts[part][i];
                    index = fItems.indexOf(key);
                    if (index !== -1) {
                        result = index;
                        break;
                    }
                }

                return result;
            }

            if (Datetime.not(format) || (""+format).trim() === "") {
                return datetime();
            }

            /* eslint-disable-next-line */
            norm = str.replace(/[\/,.:\s]/g, '-');
            /* eslint-disable-next-line */
            normFormat = format.toLowerCase().replace(/[^a-zA-Z0-9%]/g, '-');
            fItems = normFormat.split('-');
            dItems = norm.split('-');

            if (norm.replace(/-/g,"").trim() === "") {
                return Datetime.INVALID_DATE;
            }

            iMonth = getPartIndex("month");
            iDay = getPartIndex("day");
            iYear = getPartIndex("year");
            iHour = getPartIndex("hour");
            iMinute = getPartIndex("minute");
            iSecond = getPartIndex("second");

            if (iMonth > -1 && dItems[iMonth] !== "") {
                if (isNaN(parseInt(dItems[iMonth]))) {
                    dItems[iMonth] = monthNameToNumber(dItems[iMonth]);
                    if (dItems[iMonth] === -1) {
                        return Datetime.INVALID_DATE;
                    }
                } else {
                    parsedMonth = parseInt(dItems[iMonth]);
                    if (parsedMonth < 1 || parsedMonth > 12) {
                        return Datetime.INVALID_DATE;
                    }
                }
            } else {
                return Datetime.INVALID_DATE;
            }

            year  = iYear > -1 && dItems[iYear] ? dItems[iYear] : null;
            month = iMonth > -1 && dItems[iMonth] ? dItems[iMonth] : null;
            day   = iDay > -1 && dItems[iDay] ? dItems[iDay] : null;

            hour    = iHour > -1 && dItems[iHour] ? dItems[iHour] : null;
            minute  = iMinute > -1 && dItems[iMinute] ? dItems[iMinute] : null;
            second  = iSecond > -1 && dItems[iSecond] ? dItems[iSecond] : null;

            return datetime(year, month-1, day, hour, minute, second);
        }
    })

}());


// Source: src/plugins/quarter.js

/* global Datetime */
(function() {
    'use strict';

    Datetime.use({
        quarter: function(){
            var month = this.month();

            if (month <= 2) return 1;
            if (month <= 5) return 2;
            if (month <= 8) return 3;
            return 4;
        }
    })
}());


// Source: src/plugins/strftime.js

/* global Datetime */
(function() {
    'use strict';

    var REGEX_FORMAT_STRFTIME = /(%[a-z])/gi;
    var DEFAULT_FORMAT_STRFTIME = "%Y-%m-%dT%H:%M:%S.%Q%t";

    var lpad = Datetime.lpad;

    Datetime.use({
        strftime: function(fmt, locale){
            if (!this.isValid()) return Datetime.INVALID_DATE;

            var format = fmt || DEFAULT_FORMAT_STRFTIME;
            var names = Datetime.getNames(locale || this.locale);
            var year = this.year(), year2 = this.year2(), month = this.month(), day = this.day(), weekDay = this.weekDay();
            var hour = this.hour(), hour12 = this.hour12(), minute = this.minute(), second = this.second(), millisecond = this.millisecond(), time = this.time();
            var aDay = lpad(day, "0", 2),
                aMonth = lpad(month + 1, "0", 2),
                aHour = lpad(hour, "0", 2),
                aHour12 = lpad(hour12, "0", 2),
                aMinute = lpad(minute, "0", 2),
                aSecond = lpad(second, "0", 2),
                aMillisecond = lpad(millisecond, "0", 3);

            var that = this;

            var thursday = function(){
                var target = that.clone();
                target.day(that.day() - ((that.weekDay() + 6) % 7) + 3);
                return target;
            };

            var matches = {
                '%a': names.weekdaysShort[weekDay],
                '%A': names.weekdays[weekDay],
                '%b': names.monthsShort[month],
                '%h': names.monthsShort[month],
                '%B': names.months[month],
                '%c': this.toString().substring(0, this.toString().indexOf(" (")),
                '%C': this.century(),
                '%d': aDay,
                '%D': [aDay, aMonth, year].join("/"),
                '%e': day,
                '%F': [year, aMonth, aDay].join("-"),
                '%G': thursday().year(),
                '%g': (""+thursday().year()).slice(2),
                '%H': aHour,
                '%I': aHour12,
                '%j': lpad(this.dayOfYear(), "0", 3),
                '%k': aHour,
                '%l': aHour12,
                '%m': aMonth,
                '%n': month + 1,
                '%M': aMinute,
                '%p': this.ampm(),
                '%P': this.ampm(true),
                '%s': Math.round(time / 1000),
                '%S': aSecond,
                '%u': this.isoWeekDay(),
                '%V': this.isoWeek(),
                '%w': weekDay,
                '%x': this.toLocaleDateString(),
                '%X': this.toLocaleTimeString(),
                '%y': year2,
                '%Y': year,
                '%z': this.timezone().replace(":", ""),
                '%Z': this.timezoneName(),
                '%r': [aHour12, aMinute, aSecond].join(":") + " " + this.ampm(),
                '%R': [aHour, aMinute].join(":"),
                "%T": [aHour, aMinute, aSecond].join(":"),
                "%Q": aMillisecond,
                "%q": millisecond,
                "%t": this.timezone()
            };

            return format.replace(REGEX_FORMAT_STRFTIME, function(match){
                return matches[match] || match;
            });
        }
    });
}());


// Source: src/plugins/timezone.js

/* global Datetime */
(function() {
    'use strict';

    Datetime.use({
        utcOffset: function(){
            return this.value.getTimezoneOffset();
        },

        timezone: function(){
            return this.toTimeString().replace(/.+GMT([+-])(\d{2})(\d{2}).+/, '$1$2:$3');
        },

        timezoneName: function(){
            return this.toTimeString().replace(/.+\((.+?)\)$/, '$1');
        }
    })
}());


// Source: src/plugins/today.js

/* global Datetime, datetime */
(function() {
    'use strict';

    Datetime.useStatic({
        isToday: function(date){
            var d = (date instanceof  Datetime ? date.clone() : datetime(date)).align("day");
            var c = datetime().align('day');

            return d.time() === c.time();
        }
    })

    Datetime.use({
        isToday: function(){
            return Datetime.isToday(this);
        }
    })
}());


// Source: src/plugins/tomorrow.js

/* global Datetime, datetime */
(function() {
    'use strict';

    Datetime.useStatic({
        isTomorrow: function(date){
            var d = (date instanceof  Datetime ? date.clone() : datetime(date)).align("day");
            var c = datetime().align('day').add(1, 'day');

            return d.time() === c.time();
        }
    });

    Datetime.use({
        isTomorrow: function(){
            return Datetime.isTomorrow(this);
        }
    });
}());


// Source: src/plugins/unix.js

/* global Datetime, datetime */
(function() {
    'use strict';

    Datetime.useStatic({
        timestamp: function(){
            return datetime().unix();
        }
    })

    Datetime.use({
        unix: function(val) {
            var _val;

            if (!arguments.length || (Datetime.not(val))) {
                return Math.floor(this.valueOf() / 1000)
            }

            _val = val * 1000;

            if (this.mutable) {
                return this.time(_val);
            }

            return datetime(this.value).time(_val);
        },

        timestamp: function(){
            return this.unix();
        }
    });
}());


// Source: src/plugins/weekNumber.js

/* global Datetime, datetime */
(function() {
    'use strict';

    Datetime.use({
        weekNumber: function (weekStart) {
            var nYear, nday, newYear, day, daynum, weeknum;

            weekStart = +weekStart || 0;
            newYear = datetime(this.year(), 0, 1);
            day = newYear.weekDay() - weekStart;
            day = (day >= 0 ? day : day + 7);
            daynum = Math.floor(
                (this.time() - newYear.time() - (this.utcOffset() - newYear.utcOffset()) * 60000) / 86400000
            ) + 1;

            if(day < 4) {
                weeknum = Math.floor((daynum + day - 1) / 7) + 1;
                if(weeknum > 52) {
                    nYear = datetime(this.year() + 1, 0, 1);
                    nday = nYear.weekDay() - weekStart;
                    nday = nday >= 0 ? nday : nday + 7;
                    weeknum = nday < 4 ? 1 : 53;
                }
            }
            else {
                weeknum = Math.floor((daynum + day - 1) / 7);
            }
            return weeknum;
        }
    })
}());


// Source: src/plugins/weeksinyear.js

/* global Datetime */
(function() {
    'use strict';

    Datetime.use({
        weeksInYear: function(weekStart){
            var curr = this.clone();
            return curr.month(11).day(31).weekNumber(weekStart);
        }
    })
}());


// Source: src/plugins/year2.js

/* global Datetime */
(function() {
    'use strict';

    Datetime.use({
        year2: function(){
            return (""+this.year()).substr(-2);
        }
    })
}());


// Source: src/plugins/yesterday.js

/* global Datetime, datetime */
(function() {
    'use strict';

    Datetime.useStatic({
        isYesterday: function(date){
            var d = (date instanceof  Datetime ? date.clone() : datetime(date)).align("day");
            var c = datetime().align('day').add(-1, 'day');

            return d.time() === c.time();
        }
    });

    Datetime.use({
        isYesterday: function(){
            return Datetime.isYesterday(this);
        }
    })
}());
