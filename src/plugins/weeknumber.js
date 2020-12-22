/* global Datetime, datetime */
(function() {
    'use strict';

    var fnFormat = Datetime.prototype.format;
    var lpad = Datetime.lpad;

    Datetime.use({
        // TODO Need optimisation
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
        },

        isoWeekNumber: function(){
            return this.weekNumber(1);
        },

        format: function(format, locale){
            var matches, result, wn = this.weekNumber(), wni = this.isoWeekNumber();

            format = format || Datetime.DEFAULT_FORMAT;

            matches = {
                W: wn,
                WW: lpad(wn, "0", 2),
                WWW: wni,
                WWWW: lpad(wni, "0", 2)
            };

            result = format.replace(/(\[[^\]]+])|W{1,4}/g, function(match, $1){
                return $1 || matches[match];
            });

            return fnFormat.bind(this)(result, locale)
        }
    })
}());
