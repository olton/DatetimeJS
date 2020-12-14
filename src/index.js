/* global global*/
(function(global) {
    'use strict';

    var DEFAULT_FORMAT = "YYYY-MM-DDTHH:mm:ss.sssZ";
    var INVALID_DATE = "Invalid date";
    var REGEX_FORMAT = /\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|m{1,2}|s{1,3}|(^[T][a-zA-Z]{1,4})/g;

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
        ms: "ms",
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
        return datetime()[asDate ? "val" : "time"]();
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

    Datetime.align = function(d, align){
        var date = d instanceof Datetime ? d : datetime(d),
            result, temp;

        switch (align) {
            case C.s:  result = date.ms(0); break; //second
            case C.m:  result = Datetime.align(date, C.s)[C.s](0); break; //minute
            case C.h:  result = Datetime.align(date, C.m)[C.m](0); break; //hour
            case C.D:  result = Datetime.align(date, C.h)[C.h](0); break; //day
            case C.M:  result = Datetime.align(date, C.D)[C.D](1); break; //month
            case C.Y:  result = Datetime.align(date, C.M)[C.M](0); break; //year
            case C.W:  {
                temp = date.weekDay();
                result = Datetime.align(date, C.D).addDay(-temp);
                break; // week
            }
            default:   result = date;
        }
        return result;
    }

    Datetime.alignEnd = function(d, align){
        var date = d instanceof Datetime ? d : datetime(d),
            result, temp;

        switch (align) {
            case C.ms: result = date.ms(999); break; //second
            case C.s:  result = Datetime.alignEnd(date, C.ms); break; //second
            case C.m:  result = Datetime.alignEnd(date, C.s)[C.s](59); break; //minute
            case C.h:  result = Datetime.alignEnd(date, C.m)[C.m](59); break; //hour
            case C.D:  result = Datetime.alignEnd(date, C.h)[C.h](23); break; //day
            case C.M:  result = Datetime.alignEnd(date, C.D)[C.D](1).add(1, C.M).add(-1, C.D); break; //month
            case C.Y:  result = Datetime.alignEnd(date, C.D)[C.M](11)[C.D](31); break; //year
            case C.W:  {
                temp = date.weekDay();
                result = Datetime.align(date, 'day').addDay(6 - temp);
                break; // week
            }

            default:   result = date;
        }

        return result;
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
            if (typeof Datetime.getNames(val) === "undefined") {
                console.warn("Locale " + val + " not defined!");
                return this;
            }
            this.locale = val;
            this.weekStart = Datetime.getNames(val).weekStart;
            return this;
        },

        clone: function(){
            var c = datetime(this.value);
            c.locale = this.locale;
            c.mutable = this.mutable;
            c.weekStart = this.weekStart;
            return c;
        },

        align: function(to){
            if (this.mutable) {
                this.value = Datetime.align(this, to).val();
                return this;
            }

            return this.clone().immutable(false).align(to).immutable(!this.mutable);
        },

        alignEnd: function(to){
            if (this.mutable) {
                this.value = Datetime.alignEnd(this, to).val();
                return this;
            }

            return this.clone().immutable(false).alignEnd(to).immutable(!this.mutable);
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
            var fn = "get" + (this.utcMode && m !== "t" ? "UTC" : "") + M[m];
            return this.value[fn]();
        },

        _work: function(part, val){
            if (!arguments.length || (typeof val === "undefined" || val === null)) {
                return this._get(part);
            }
            return this._set(part, val);
        },

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
            var year = this.year(), year2 = this.year2(), month = this.month(), day = this.day(), weekDay = this.weekDay();
            var hour = this.hour(), minute = this.minute(), second = this.second(), ms = this.ms();
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
                H: hour,
                HH: lpad(hour, "0", 2),
                m: minute,
                mm: lpad(minute,"0", 2),
                s: second,
                ss: lpad(second,"0", 2),
                sss: lpad(ms,"0", 3)
            };

            return format.replace(REGEX_FORMAT, function(match){
                return matches[match] === 0 || matches[match] ? matches[match] : match;
            });
        },

        valueOf: function(){
            return this.value.valueOf();
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
