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
            var hour = this.hour(), hour12 = this.hour12(), minute = this.minute(), second = this.second(), ms = this.ms(), time = this.time();
            var aDay = lpad(day, "0", 2),
                aMonth = lpad(month + 1, "0", 2),
                aHour = lpad(hour, "0", 2),
                aHour12 = lpad(hour12, "0", 2),
                aMinute = lpad(minute, "0", 2),
                aSecond = lpad(second, "0", 2),
                aMs = lpad(ms, "0", 3);

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
                "%Q": aMs,
                "%q": ms,
                "%t": this.timezone()
            };

            return format.replace(REGEX_FORMAT_STRFTIME, function(match){
                return matches[match] === 0 || matches[match] ? matches[match] : match;
            });
        }
    });
}());
