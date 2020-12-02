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
    /* ************* End of static **************** */

    Datetime.prototype = {
        useLocale: function(val){
            this.locale = val;
            return this;
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

        val: function(){
            return this.value;
        },

        unix: function(val) {
            if (arguments.length === 1 || typeof val === "undefined") {
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
            if (arguments.length === 1 || typeof val === "undefined") {
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

        hour12: function(){
            return this.hour() % 12 || 12;
        },

        get: function(unit){
            switch (unit) {
                case "day":
                case "D": return this.day();

                case "weekDay":
                case "d": return this.weekDay();

                case "week":
                case "w": return this.week();

                case "month":
                case "M": return this.month();

                case "year":
                case "Y": return this.year();
                case "y": return this.year2();

                case "hour":
                case "h": return this.hour();

                case "minute":
                case "m": return this.minute();

                case "second":
                case "s": return this.second();

                case "millisecond":
                case "ms": return this.millisecond();

                case "time":
                case "t": return this.time();

                case "century":
                case "c": return this.century();

                default: return this.valueOf();
            }
        },

        set: function(unit, val){
            val = val || 0;
            switch (unit) {
                case "day":
                case "d":
                case "D": return this.day(val);

                case "month":
                case "M": return this.month(val);

                case "year":
                case "Y":
                case "y": return this.year(val);

                case "hour":
                case "h": return this.hour(val);

                case "minute":
                case "m": return this.minute(val);

                case "second":
                case "s": return this.second(val);

                case "millisecond":
                case "ms": return this.millisecond(val);

                case "time":
                case "t": return this.time(val);
            }
        },

        add: function(to, val){
            switch (to) {
                case "hour":
                case "hours":
                case "h": this.time(this.time() + (val * 60 * 60 * 1000)); break;

                case "minute":
                case "minutes":
                case "m": this.time(this.time() + (val * 60 * 1000)); break;

                case "second":
                case "seconds":
                case "s": this.time(this.time() + (val * 1000)); break;

                case "millisecond":
                case "milliseconds":
                case "ms": this.time(this.time() + (val)); break;

                case "day":
                case "days":
                case "date":
                case "d": this.date(this.date() + val); break;

                case "week":
                case "weeks":
                case "w": this.date(this.date() + val * 7); break;

                case "month":
                case "M": this.month(this.month() + val); break;

                case "year":
                case "years":
                case "y":
                case "Y": this.year(this.year() + val); break;
            }
            return this;
        },

        addHour: function(v){return this.add('h', v);},
        addMinute: function(v){return this.add('m', v);},
        addSecond: function(v){return this.add('s', v);},
        addMillisecond: function(v){return this.add('ms', v);},
        addDay: function(v){return this.add('d', v);},
        addWeek: function(v){return this.add('w', v);},
        addMonth: function(v){return this.add('M', v);},
        addYear: function(v){return this.add('Y', v);},

        // Information

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
            day = newYear.day() - weekStart;
            day = (day >= 0 ? day : day + 7);
            daynum = Math.floor(
                (this.time() - newYear.time() - (this.offset() - newYear.offset()) * 60000) / 86400000
            ) + 1;

            if(day < 4) {
                weeknum = Math.floor((daynum+day-1)/7) + 1;
                if(weeknum > 52) {
                    nYear = datetime(this.year() + 1, 0, 1);
                    nday = nYear.day() - weekStart;
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
            var matches = {
                '%a': names.weekdaysShort[weekDay],
                '%A': names.weekdays[weekDay],
                '%b': names.monthsShort[month],
                '%h': names.monthsShort[month],
                '%B': names.months[month],
                '%c': "",
                '%C': this.century(),
                '%d': lpad(day, "0", 2),
                '%D': [day, month + 1, year].join("/"),
                '%e': day,
                '%F': [year, month + 1, day].join("-"),
                '%G': "",
                '%g': "",
                '%H': lpad(hour, "0", 2),
                '%I': lpad(hour12, "0", 2),
                '%j': lpad(this.dayOfYear(), "0", 3),
                '%k': lpad(hour, "0", 2),
                '%l': lpad(hour12, "0", 2),
                '%m': lpad(month + 1, "0", 2),
                '%n': month + 1,
                '%M': lpad(minute, "0", 2),
                '%p': this.ampm(),
                '%P': this.ampm(true),
                '%s': Math.round(time / 1000),
                '%S': lpad(second, "0", 2),
                '%u': "", //Day of the week as a decimal (range 1 to 7), Monday being 1.
                '%V': this.week(),
                '%w': weekDay,
                '%x': this.toLocaleDateString(),
                '%X': this.toLocaleTimeString(),
                '%y': year2,
                '%Y': year,
                '%z': this.timezone().replace(":", ""),
                '%Z': this.timezoneName(),
                '%r': [lpad(hour12, "0", 2), lpad(minute, "0", 2), lpad(second, "0", 2)].join(":") + " " + this.ampm(),
                '%R': [lpad(hour, "0", 2), lpad(minute, "0", 2)].join(":"),
                "%t": "\t",
                "%T": [lpad(hour, "0", 2), lpad(minute, "0", 2), lpad(second, "0", 2)].join(":")
            };

            return format.replace(REGEX_FORMAT_STRFTIME, function(match){
                return matches[match] || match;
            });
        },

        toTimeString: function(){
            return this.isValid() ? this.value.toTimeString() : INVALID_DATE;
        },

        toLocaleDateString: function(){
            return this.value.toLocaleDateString();
        },

        toLocaleTimeString: function(){
            return this.value.toLocaleTimeString();
        },

        toString: function(){
            return this.isValid() ? this.value.toString() : INVALID_DATE;
        },
    }

    global.Datetime = Datetime;
    global.datetime = datetime;

}(typeof self === "undefined" ? typeof global === "undefined" ? window : global : self));
/* eslint-enable */
