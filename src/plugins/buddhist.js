/* eslint-disable */
(function(global) {
    'use strict';

    var oldFormat = Datetime.prototype.format;

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
            var result = format.replace(/(\[[^\]]+])|B{4}|B{2}/g, function(match){
                return matches[match] || match;
            })
            return oldFormat.bind(this)(result, locale)
        }
    });
}(typeof self === "undefined" ? typeof global === "undefined" ? window : global : self));
/* eslint-enable */
