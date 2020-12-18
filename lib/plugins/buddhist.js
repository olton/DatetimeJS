
(function() {
    'use strict';

    var fnFormat = Datetime.prototype.format;

    Datetime.use({
        buddhist: function(){
            return this.year() + 543;
        },

        format: function(format, locale){
            format = format || Datetime.DEFAULT_FORMAT;
            var matches = {
                BB: (this.buddhist()+"").slice(-2),
                BBBB: this.buddhist()
            }
            var result = format.replace(/(\[[^\]]+])|B{4}|B{2}/g, function(match, $1){
                return $1 || matches[match];
            })
            return fnFormat.bind(this)(result, locale)
        }
    });
}());
