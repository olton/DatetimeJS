/* global Datetime */
(function() {
    'use strict';

    var fnFormat = Datetime.prototype.format;
    var lpad = Datetime.lpad;

    Datetime.use({
        ampm: function(isLowerCase){
            var val = this.hour() < 12 ? "AM" : "PM";
            return isLowerCase ? val.toLowerCase() : val;
        },

        hour12: function(h, p){
            var hour = h;

            if (arguments.length === 0) {
                return this.hour() % 12;
            }

            p = p || 'am';

            if (p.toLowerCase() === "pm") {
                hour += 12;
            }

            return this.hour(hour);
        },

        format: function(format, locale){
            var matches, result, h12 = this.hour12();

            format = format || Datetime.DEFAULT_FORMAT;

            matches = {
                a: this.ampm(true),
                A: this.ampm(false),
                h: h12,
                hh: lpad(h12, "0", 2)
            };

            result = format.replace(/(\[[^\]]+])|a|A|h{1,2}/g, function(match){
                return matches[match] === 0 || matches[match] ? matches[match] : match;
            });

            return fnFormat.bind(this)(result, locale)
        }
    })
}());
