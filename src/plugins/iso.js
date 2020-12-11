/* global Datetime */
(function() {
    'use strict';

    var oldFormat = Datetime.prototype.format;

    Datetime.use({
        isoWeekDay: function(val){
            if (!arguments.length || (Datetime.not(val))) {
                return (this.weekDay() + 6) % 7 + 1;
            }

            return this.weekDay((val + 6) % 7 + 1);
        },

        isoWeekNumber: function(){
            return this.weekNumber(1);
        },

        format: function(format, locale){
            format = format || Datetime.DEFAULT_FORMAT;
            var matches = {
                C: this.century()
            }
            var result = format.replace(/(\[[^\]]+])|C/g, function(match){
                return matches[match] || match;
            })
            return oldFormat.bind(this)(result, locale)
        }
    })
}());
