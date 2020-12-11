/* global Datetime */
(function() {
    'use strict';

    var oldFormat = Datetime.prototype.format;

    Datetime.use({
        century: function(){
            return parseInt(this.year() / 100);
        },

        format: function(format, locale){
            format = format || Datetime.DEFAULT_FORMAT;
            var matches = {
                I: this.isoWeekDay(),
                II: this.isoWeekNumber()
            }
            var result = format.replace(/(\[[^\]]+])|I{1,2}/g, function(match){
                return matches[match] || match;
            })
            return oldFormat.bind(this)(result, locale)
        }
    })
}());
