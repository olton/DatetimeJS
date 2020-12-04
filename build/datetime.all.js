/*
 * Datetime v0.1.0, (https://github.com/olton/Datetime.git)
 * Copyright 2020 by Serhii Pimenov
 * Immutable date-time library with the modern API
 * Licensed under MIT
 */


// Source: src/index.js

/* eslint-disable */
(function(global) {
    'use strict';

    var DEFAULT_FORMAT = "YYYY-MM-DDTHH:mm:ss.sssZ";
    var DEFAULT_FORMAT_STRFTIME = "%Y-%m-%d %H:%M:%S %z";
    var INVALID_DATE = "Invalid date";
    var REGEX_FORMAT = /\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,3}|Z{1,2}|z{1,2}|C|W{1,2}|I{1,3}/g;
    var REGEX_FORMAT_STRFTIME = /(%[a-z])/gi;

    global['DATETIME_LOCALES'] = {
        "en": {
            months: "January February March April May June July August September October November December".split(" "),
            monthsShort: "Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" "),
            weekdays: "Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" "),
            weekdaysShort: "Sun Mon Tue Wed Thu Fri Sat".split(" "),
            weekdaysTwo: "Su Mo Tu We Th Fr Sa".split(" "),
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
    }

    /* ************ Static methods **************** */
    Datetime.isDatetime = function(val){
        return val instanceof Datetime;
    }

    Datetime.now = function(asDate){
        return asDate ? datetime().val() : datetime().time();
    }

    Datetime.unix = function(timestamp){
        return datetime(timestamp * 1000);
    }

    Datetime.locale = function(name, locale){
        global['DATETIME_LOCALES'][name] = locale;
    }

    Datetime.align = function(d, align, asDate){
        var date = datetime(d), result;
        switch (align) {
            case C.s: result = date.millisecond(0); break;
            case C.m: result = date.millisecond(0).second(0); break;
            case C.h: result = date.millisecond(0).second(0).minute(0); break;
            case C.D: result = date.millisecond(0).second(0).minute(0).hour(0); break;
            case C.M: result = date.millisecond(0).second(0).minute(0).hour(0).day(1); break;
            case C.Y: result = date.millisecond(0).second(0).minute(0).hour(0).day(1).month(0); break;
            case C.q: result = date.millisecond(0).second(0).minute(0).hour(0).day(1).month(date.quarter() * 3 - 3); break;
            case C.w: result = date.millisecond(0).second(0).minute(0).hour(0).add(-date.weekDay(), 'day'); break;
            case C.WI: result = date.millisecond(0).second(0).minute(0).hour(0).add(-date.isoWeekDay() + 1, 'day'); break;
            default: result = date;
        }
        return asDate ? result.val() : result;
    }

    Datetime.parse = function(str){
        return datetime(Date.parse(str));
    }

    Datetime.fromString = function(str, format, locale){
        var normalized, normalizedFormat, formatItems, dateItems, checkValue;
        var monthIndex, dayIndex, yearIndex, hourIndex, minutesIndex, secondsIndex;
        var year, month, day, hour, minute, second;
        var parsedMonth;

        var monthNameToNumber = function(month){
            var index = -1;
            var names = global['DATETIME_LOCALES'][locale || 'en'];

            if (not(month)) return -1;

            index = names.months.map(function(el){
                return el.toLowerCase();
            }).indexOf(month.toLowerCase());

            if (index === -1 && typeof names["monthsParental"] !== "undefined") {
                index = names.monthsParental.map(function(el){
                    return el.toLowerCase();
                }).indexOf(month.toLowerCase());
            }

            if (index === -1) {
                month = month.substr(0, 3);
                index = names.monthsShort.map(function(el){
                    return el.toLowerCase();
                }).indexOf(month.toLowerCase());
            }

            return index === -1 ? -1 : index + 1;
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
                index = formatItems.indexOf(key);
                if (index !== -1) {
                    result = index;
                    break;
                }
            }

            return result;
        }

        if (not(format) || (""+format).trim() === "") {
            return datetime();
        }

        /* eslint-disable-next-line */
        normalized      = str.replace(/[\/,.:\s]/g, '-');
        /* eslint-disable-next-line */
        normalizedFormat= format.toLowerCase().replace(/[^a-zA-Z0-9%]/g, '-');
        formatItems     = normalizedFormat.split('-');
        dateItems       = normalized.split('-');
        checkValue      = normalized.replace(/-/g,"");

        if (checkValue.trim() === "") {
            return INVALID_DATE;
        }

        monthIndex = getPartIndex(C.M);
        dayIndex = getPartIndex(C.D);
        yearIndex = getPartIndex(C.Y);
        hourIndex = getPartIndex(C.h);
        minutesIndex = getPartIndex(C.m);
        secondsIndex = getPartIndex(C.s);

        if (monthIndex > -1 && dateItems[monthIndex] !== "") {
            if (isNaN(parseInt(dateItems[monthIndex]))) {
                dateItems[monthIndex] = monthNameToNumber(dateItems[monthIndex]);
                if (dateItems[monthIndex] === -1) {
                    return INVALID_DATE;
                }
            } else {
                parsedMonth = parseInt(dateItems[monthIndex]);
                if (parsedMonth < 1 || parsedMonth > 12) {
                    return INVALID_DATE;
                }
            }
        } else {
            return INVALID_DATE;
        }

        year  = yearIndex >-1 && dateItems[yearIndex] !== "" ? dateItems[yearIndex] : null;
        month = monthIndex >-1 && dateItems[monthIndex] !== "" ? dateItems[monthIndex] : null;
        day   = dayIndex >-1 && dateItems[dayIndex] !== "" ? dateItems[dayIndex] : null;

        hour    = hourIndex >-1 && dateItems[hourIndex] !== "" ? dateItems[hourIndex] : null;
        minute  = minutesIndex>-1 && dateItems[minutesIndex] !== "" ? dateItems[minutesIndex] : null;
        second  = secondsIndex>-1 && dateItems[secondsIndex] !== "" ? dateItems[secondsIndex] : null;

        return datetime(year, month-1, day, hour, minute, second);
    }

    // Extender for plugins
    var extend = function(where, obj){
        var options, name,
            length = arguments.length;

        var target = where;

        for (var i = 0; i < length; i++ ) {
            if ( ( options = arguments[ i ] ) != null ) {
                for ( name in options ) {
                    if (options.hasOwnProperty(name))
                        target[ name ] = options[ name ];
                }
            }
        }

        return target;
    }

    Datetime.use = function(obj){
        extend(Datetime.prototype, obj);
    }

    Datetime.useStatic = function(obj){
        extend(Datetime, obj);
    }
    /* ************* End of static **************** */

    Datetime.prototype = {
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
            return datetime(this.value);
        },

        same: function(d){
            return this.time() === datetime(d).time();
        },

        isValid: function(){
            return !isNaN(this.time());
        },

        isLeapYear: function(){
            var year = this.year();
            return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
        },

        year2: function(){
            return (""+this.year()).substr(-2);
        },

        century: function(){
            return parseInt(this.year() / 100);
        },

        dayOfYear: function(){
            var dayCount = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
            var month = this.month();
            var day = this.day();
            return dayCount[month] + day + ((month > 1 && this.isLeapYear()) ? 1 : 0);
        },

        ampm: function(isLowerCase){
            var val = this.hour() < 12 ? "AM" : "PM";
            return isLowerCase ? val.toLowerCase() : val;
        },

        val: function(val){
            if ( !(val instanceof Date) )
                return this.value;

            this.value = val;
            return this;
        },

        unix: function(val) {
            if (!arguments.length || (not(val))) {
                return Math.floor(this.valueOf() / 1000)
            }
            return this.time(val * 1000);
        },

        valueOf: function(){
            return this.value.getTime();
        },

        /* Get + Set */

        _set: function(m, v){
            this.value["set"+(this.utcMode && m !== "t" ? "UTC" : "")+M[m]](v);
            return this;
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
        },

        isoWeekDay: function(val){
            if (!arguments.length || (not(val))) {
                return (this.weekDay() + 6) % 7 + 1;
            }

            return this.weekDay((val + 6) % 7 + 1);
        },

        isoWeek: function(){
            return this.week(1);
        },

        weeksInYear: function(weekStart){
            var curr = this.clone();
            return curr.month(11).day(31).week(weekStart);
        },

        get: function(unit){
            switch (unit) {
                case C.D: return this.day();
                case C.d: return this.weekDay();
                case C.dI: return this.isoWeekDay();
                case C.W: return this.week();
                case C.WI: return this.isoWeek();
                case C.M: return this.month();
                case C.Y: return this.year();
                case C.Y2: return this.year2();
                case C.h: return this.hour();
                case C.m: return this.minute();
                case C.s: return this.second();
                case C.ms: return this.millisecond();
                case C.t: return this.time();
                case C.c: return this.century();
                default: return this.valueOf();
            }
        },

        set: function(unit, val){
            val = val || 0;
            switch (unit) {
                case C.D: return this.day(val);
                case C.M: return this.month(val);
                case C.Y: return this.year(val);
                case C.h: return this.hour(val);
                case C.m: return this.minute(val);
                case C.s: return this.second(val);
                case C.ms: return this.millisecond(val);
                case C.t: return this.time(val);
            }
        },

        add: function(val, to){
            switch (to) {
                case C.h: this.time(this.time() + (val * 60 * 60 * 1000)); break;
                case C.m: this.time(this.time() + (val * 60 * 1000)); break;
                case C.s: this.time(this.time() + (val * 1000)); break;
                case C.ms: this.time(this.time() + (val)); break;
                case C.D: this.day(this.day() + val); break;
                case C.W: this.day(this.day() + val * 7); break;
                case C.M: this.month(this.month() + val); break;
                case C.Y: this.year(this.year() + val); break;
                case C.q: this.month(this.month() + val * 3); break;
            }
            return this;
        },

        addHour: function(v){return this.add(v,C.h);},
        addMinute: function(v){return this.add(v,C.m);},
        addSecond: function(v){return this.add(v, C.s);},
        addMillisecond: function(v){return this.add(v, C.ms);},
        addDay: function(v){return this.add(v,C.D);},
        addWeek: function(v){return this.add(v,C.W);},
        addMonth: function(v){return this.add(v, C.M);},
        addYear: function(v){return this.add(v, C.Y);},

        between: function(d1, d2){
            return this.younger(d1) && this.older(d2);
        },

        align: function(align){
            this.value = Datetime.align(this.value, align, true);
            return this;
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

            align = (align || C.ms).toLowerCase();

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
        },

        daysInMonth: function(){
            var curr = this.clone();
            return curr.add(1, 'month').day(1).add(-1, 'day').day();
        },

        daysInYear: function(){
            return this.daysInYearMap().reduce(function(a, b){
                return a + b;
            }, 0)
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

        daysInYearObj: function(locale){
            var map = this.daysInYearMap();
            var result = {};
            var names = global['DATETIME_LOCALES'][locale || this.locale];

            map.forEach(function(v, i){
                result[names['months'][i]] = v;
            });

            return result;
        },

        quarter: function(){
            var month = this.month();
            if (month <= 2) return 1;
            if (month > 2 && month <= 5) return 2;
            if (month > 5 && month <= 8) return 3;
            return 4;
        },

        utcOffset: function(){
            return this.value.getTimezoneOffset();
        },

        timezone: function(){
            return this.toTimeString().replace(/.+GMT([+-])(\d{2})(\d{2}).+/, '$1$2:$3');
        },

        timezoneName: function(){
            return this.toTimeString().replace(/.+\((.+?)\)$/, '$1');
        },

        week: function (weekStart) {
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
        },

        format: function(fmt, locale){
            if (!this.isValid()) return INVALID_DATE;

            var format = fmt || DEFAULT_FORMAT;
            var names = global['DATETIME_LOCALES'][locale || this.locale];
            var year = this.year(), year2 = this.year2(), month = this.month(), day = this.day(), weekDay = this.weekDay(), week = this.week();
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
                dd: names.weekdaysTwo[weekDay],
                ddd: names.weekdaysShort[weekDay],
                dddd: names.weekdays[weekDay],
                W: week,
                WW: lpad(week, "0", 2),
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
                II: this.isoWeek()
            };

            return format.replace(REGEX_FORMAT, function(match, $1){
                return $1 || matches[match];
            });
        },

        strftime: function(fmt, locale){
            if (!this.isValid()) return INVALID_DATE;

            var format = fmt || DEFAULT_FORMAT_STRFTIME;
            var names = global['DATETIME_LOCALES'][locale || this.locale];
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
/* eslint-enable */


// Source: src/i18n/af.js

/* eslint-disable */
(function(Datetime) {
    'use strict';

    var locale = {
        months: "Januarie Februarie Maart April Mei Junie Julie Augustus September Oktober November Desember".split(" "),
        monthsShort: "Jan Feb Mrt Apr Mei Jun Jul Aug Sep Okt Nov Des".split(" "),
        weekdays: "Sondag Maandag Dinsdag Woensdag Donderdag Vrydag Saterdag".split(" "),
        weekdaysShort: "Son Maa Din Woe Don Vry Sat".split(" "),
        weekdaysTwo: "So Ma Di Wo Do Vr Sa".split(" "),
        weekStart: 1
    };

    Datetime.locale("af", locale);
}(Datetime));
/* eslint-enable */

// Source: src/i18n/ru.js

/* eslint-disable */
(function(Datetime) {
    'use strict';

    var locale = {
        months: "Январь Февраль Март Апрель Май Июнь Июль Август Сентябрь Октябрь Ноябрь Декабрь".split(" "),
        monthsParental: "Января Февраля Марта Апреля Мая Июня Июля Августа Сентября Октября Ноября Декабря".split(" "),
        monthsShort: "Янв Фев Мар Апр Май Июн Июл Авг Сен Окт Ноя Дек".split(" "),
        weekdays: "Воскресенье Понедельник Вторник Среда Четверг Пятница Суббота".split(" "),
        weekdaysShort: "Вск Пон Втр Срд Чет Пят Суб".split(" "),
        weekdaysTwo: "Вс Пн Вт Ср Чт Пт Сб".split(" "),
        weekStart: 1
    };

    Datetime.locale("ru", locale);
}(Datetime));
/* eslint-enable */


// Source: src/i18n/ua.js

/* eslint-disable */
(function(Datetime) {
    'use strict';

    var locale = {
        months: "Січень Лютий Березень Квітень Травень Червень Липень Серпень Вересень Жовтень Листопад Грудень".split(" "),
        monthsParental: "Січня Лютого Березеня Квітня Травня Червня Липня Серпня Вересня Жовтня Листопада Грудня".split(" "),
        monthsShort: "Січ Лют Бер Кві Тра Чер Лип Сер Вер Жов Лис Гру".split(" "),
        weekdays: "Неділя Понеділок Вівторок Середа Четвер П'ятниця Субота".split(" "),
        weekdaysShort: "Нед Пон Вів Сер Чет Птн Суб".split(" "),
        weekdaysTwo: "Нд Пн Вт Ср Чт Пт Сб".split(" "),
        weekStart: 1
    };

    Datetime.locale("ua", locale);
}(Datetime));
/* eslint-enable */


// Source: src/plugins/test.js

/* eslint-disable */
(function(global) {
    'use strict';

    Datetime.use({
        test: function(val){
            if (val !== 0 && !val) {
                return "test";
            }

            return val;
        }
    });

    Datetime.useStatic({
        test: function(val){
            if (val !== 0 && !val) {
                return "static test";
            }

            return val;
        }
    });
}(typeof self === "undefined" ? typeof global === "undefined" ? window : global : self));
/* eslint-enable */
