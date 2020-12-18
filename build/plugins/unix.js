/* global Datetime, datetime */
(function() {
    'use strict';

    Datetime.useStatic({
        timestamp: function(){
            return datetime().unix();
        }
    })

    Datetime.use({
        unix: function(val) {
            var _val;

            if (!arguments.length || (Datetime.not(val))) {
                return Math.floor(this.valueOf() / 1000)
            }

            _val = val * 1000;

            if (this.mutable) {
                return this.time(_val);
            }

            return datetime(this.value).time(_val);
        },

        timestamp: function(){
            return this.unix();
        }
    });
}());
