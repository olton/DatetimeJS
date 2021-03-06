
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
                C: this.century()
            }
            var result = format.replace(/(\[[^\]]+])|C/g, function(match, $1){
                return $1 || matches[match];
            })
            return oldFormat.bind(this)(result, locale)
        }
    })
}());
