
(function() {
    'use strict';

    var fnFormat = Datetime.prototype.format;

    Datetime.use({
        utcOffset: function(){
            return this.value.getTimezoneOffset();
        },

        timezone: function(){
            return this.toTimeString().replace(/.+GMT([+-])(\d{2})(\d{2}).+/, '$1$2:$3');
        },

        timezoneName: function(){
            return this.toTimeString().replace(/.+\((.+?)\)$/, '$1');
        },

        format: function(format, locale){
            format = format || Datetime.DEFAULT_FORMAT;

            var matches = {
                Z: this.utcMode ? "Z" : this.timezone(),
                ZZ: this.timezone().replace(":", ""),
                ZZZ: "[GMT]"+this.timezone(),
                z: this.timezoneName()
            }
            var result = format.replace(/(\[[^\]]+])|Z{1,3}|z/g, function(match, $1){
                return $1 || matches[match];
            })

            return fnFormat.bind(this)(result, locale)
        }
    })
}());
