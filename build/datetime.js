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
    var REGEX_PARSE = /^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[^0-9]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?.?(\d+)?$/;
    var REGEX_FORMAT = /\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,3}|Z{1,2}|z{1,2}|C/g;
    var REGEX_FORMAT_STRFTIME = /(%[a-z])/gi;

    global['DATETIME_LOCALES'] = {
        "en": {
            months: "January February March April May June July August September October November December".split(" "),
            monthsShort: "Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" "),
            weekdays: "Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" "),
            weekdaysShort: "Sun Mon Tue Wed Thu Fri Sat".split(" "),
            weekdaysTwo: "Su Mo Tu We Th Fr Sa".split(" ")
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
        w: "Week",
        Q: "Quarter",
        t: "Time"
    }

    var lpad = function(str, pad, length){
        var _str = ""+str;
        if (length && _str.length >= length) {
            return _str;
        }
        return Array((length + 1) - _str.length).join(pad) + _str;
    }

    /* Fabric method */
    var datetime = function(){
        if (arguments[0] instanceof Datetime) {
            return arguments[0].clone();
        }
        var args = [].slice.call(arguments);
        return new (Function.prototype.bind.apply(Datetime,  [this].concat(args) ) );
    }

    /* Main class */
    var Datetime = function(){
        var args = [].slice.call(arguments);
        this.value = new (Function.prototype.bind.apply(Date,  [this].concat(args) ) );
        this.locale = "en";
        this.weekStart = 0;
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
            case "second": result = date.millisecond(0); break;
            case "minute": result = date.millisecond(0).second(0); break;
            case "hour": result = date.millisecond(0).second(0).minute(0); break;
            case "day": result = date.millisecond(0).second(0).minute(0).hour(0); break;
            case "month": result = date.millisecond(0).second(0).minute(0).hour(0).day(1); break;
            case "year": result = date.millisecond(0).second(0).minute(0).hour(0).day(1).month(0); break;
            default: result = date;
        }
        return asDate ? result.val() : result;
    }
    /* ************* End of static **************** */

    Datetime.prototype = {
        useLocale: function(val){
            this.locale = val;
            return this;
        },

        clone: function(){
            return datetime(this.value);
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
            return this.year() / 100;
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
            if (!arguments.length || (typeof val === "undefined" || val === null)) {
                return Math.floor(this.valueOf() / 1000)
            }
            return this.time(val * 1000);
        },

        valueOf: function(){
            return this.value.getTime();
        },

        /* Get + Set */

        _set: function(m, v){
            this.value["set"+M[m]](v);
            return this;
        },

        _get: function(m){
            return this.value["get"+M[m]]();
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
        weekDay: function(val){return this._work("d", val);},
        day: function(val){return this._work("D", val);},
        month: function(val){return this._work("M", val);},
        year: function(val){return this._work("Y", val);},
        time: function(val){return this._work("t", val);},

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

        get: function(unit){
            switch (unit) {
                case "day": return this.day();
                case "weekDay": return this.weekDay();
                case "week": return this.week();
                case "month": return this.month();
                case "year": return this.year();
                case "year2": return this.year2();
                case "hour": return this.hour();
                case "minute": return this.minute();
                case "second": return this.second();
                case "millisecond": return this.millisecond();
                case "time": return this.time();
                case "century": return this.century();
                default: return this.valueOf();
            }
        },

        set: function(val, unit){
            val = val || 0;
            switch (unit) {
                case "day": return this.day(val);
                case "month": return this.month(val);
                case "year": return this.year(val);
                case "hour": return this.hour(val);
                case "minute": return this.minute(val);
                case "second": return this.second(val);
                case "millisecond": return this.millisecond(val);
                case "time": return this.time(val);
            }
        },

        add: function(val, to){
            switch (to) {
                case "hour": this.time(this.time() + (val * 60 * 60 * 1000)); break;
                case "minute": this.time(this.time() + (val * 60 * 1000)); break;
                case "second": this.time(this.time() + (val * 1000)); break;
                case "millisecond": this.time(this.time() + (val)); break;
                case "day": this.day(this.day() + val); break;
                case "week": this.day(this.day() + val * 7); break;
                case "month": this.month(this.month() + val); break;
                case "year": this.year(this.year() + val); break;
            }
            return this;
        },

        addHour: function(v){return this.add(v,'hour');},
        addMinute: function(v){return this.add(v,'minute');},
        addSecond: function(v){return this.add(v, 'second');},
        addMillisecond: function(v){return this.add(v, 'millisecond');},
        addDay: function(v){return this.add(v,'day');},
        addWeek: function(v){return this.add(v,'week');},
        addMonth: function(v){return this.add(v, 'month');},
        addYear: function(v){return this.add(v, 'year');},

        between: function(d1, d2){
            var time = this.time();
            return datetime(d1).time() > time && time > datetime(d2);
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

        diff: function(date, align){

        },

        daysInMonth: function(){
            var curr = this.clone();
            return curr.add(1, 'month').day(1).add(-1, 'day').day();
        },

        daysInYear: function(){
            var result = 0;
            var curr = this.clone();

            curr.month(0).day(1);

            for(var i = 0; i < 12; i++) {
                curr.add(1, 'month').add(-1, 'day');
                result += curr.day();
                curr.day(1).add(1, 'month');
            }
            return result;
        },

        // utcOffset: function(){},

        offset: function(){
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

            weekStart = +weekStart ? 1 : 0;
            newYear = datetime(this.year(), 0, 1);
            day = newYear.weekDay() - weekStart;
            day = (day >= 0 ? day : day + 7);
            daynum = Math.floor(
                (this.time() - newYear.time() - (this.offset() - newYear.offset()) * 60000) / 86400000
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
                Z: this.timezone(),
                z: "Z",
                C: this.century()
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
            var hour = this.hour(), hour12 = this.hour12(), minute = this.minute(), second = this.second(), time = this.time();
            var aDay = lpad(day, "0", 2),
                aMonth = lpad(month + 1, "0", 2),
                aHour = lpad(hour, "0", 2),
                aHour12 = lpad(hour12, "0", 2),
                aMinute = lpad(minute, "0", 2),
                aSecond = lpad(second, "0", 2);

            var matches = {
                '%a': names.weekdaysShort[weekDay],
                '%A': names.weekdays[weekDay],
                '%b': names.monthsShort[month],
                '%h': names.monthsShort[month],
                '%B': names.months[month],
                '%c': "",
                '%C': this.century(),
                '%d': aDay,
                '%D': [aDay, aMonth, year].join("/"),
                '%e': day,
                '%F': [year, aMonth, aDay].join("-"),
                '%G': "",
                '%g': "",
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
                '%u': "", //Day of the week as a decimal (range 1 to 7), Monday being 1.
                '%V': this.week(),
                '%w': weekDay,
                '%x': this.toLocaleDateString(),
                '%X': this.toLocaleTimeString(),
                '%y': year2,
                '%Y': year,
                '%z': this.timezone().replace(":", ""),
                '%Z': this.timezoneName(),
                '%r': [aHour12, aMinute, aSecond].join(":") + " " + this.ampm(),
                '%R': [aHour, aMinute].join(":"),
                "%T": [aHour, aMinute, aSecond].join(":")
            };

            return format.replace(REGEX_FORMAT_STRFTIME, function(match){
                return matches[match] || match;
            });
        },

        to: function(fn){
            return this.isValid() && typeof this.value[fn] === "function" ? this.value["to"+fn]() : INVALID_DATE;
        },

        toTimeString: function(){
            return this.to('TimeString');
        },

        toLocaleDateString: function(){
            return this.to('LocaleDateString');
        },

        toLocaleString: function(){
            return this.to('LocaleString');
        },

        toLocaleTimeString: function(){
            return this.to('LocaleTimeString');
        },

        toString: function(){
            return this.to('String');
        },

        toJSON: function(){
            return this.to('JSON');
        },

        toSource: function(){
            return this.to('Source');
        },

        toISOString: function(){
            return this.to('ISOString');
        },

        toUTCString: function(){
            return this.to('UTCString');
        },

        toDate: function(){
            return new Date(this.valueOf());
        }
    }

    global.Datetime = Datetime;
    global.datetime = datetime;

}(typeof self === "undefined" ? typeof global === "undefined" ? window : global : self));
/* eslint-enable */
