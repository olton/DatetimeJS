/* global Datetime, datetime */
(function() {
    'use strict';

    var fnFormat = Datetime.prototype.format;
    var fnAlign = Datetime.align;
    var fnAlignEnd = Datetime.alignEnd;

    Datetime.useStatic({
        align: function(d, align){
            var date = d instanceof Datetime ? d : datetime(d),
                result, temp;

            switch(align) {
                case "isoWeek":
                    temp = date.isoWeekDay();
                    result = fnAlign(date, 'day').addDay(-temp + 1);
                    break; // isoWeek

                default: result = fnAlign.apply(this, [date, align]);
            }

            return result;
        },

        alignEnd: function(d, align){
            var date = d instanceof Datetime ? d : datetime(d),
                result, temp;

            switch(align) {
                case "isoWeek":
                    temp = date.isoWeekDay();
                    result = fnAlignEnd(date, 'day').addDay(7 - temp);
                    break; // isoWeek

                default: result = fnAlignEnd.apply(this, [date, align]);
            }

            return result;
        }
    })

    Datetime.use({
        isoWeekDay: function(val){
            var wd = (this.weekDay() + 6) % 7 + 1;

            if (!arguments.length || (Datetime.not(val))) {
                return wd;
            }

            return this.addDay(val - wd);
        },

        format: function(format, locale){
            format = format || Datetime.DEFAULT_FORMAT;
            var matches = {
                I: this.isoWeekDay()
            }
            var result = format.replace(/(\[[^\]]+])|I{1,2}/g, function(match, $1){
                return $1 || matches[match];
            })
            return fnFormat.bind(this)(result, locale)
        }
    })
}());
