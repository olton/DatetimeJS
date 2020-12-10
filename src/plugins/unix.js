/* global Datetime, datetime */
(function() {
    'use strict';

    Datetime.use({
        unix: function(val) {
            var _val = val * 1000;
            if (!arguments.length || (Datetime.not(val))) {
                return Math.floor(this.valueOf() / 1000)
            }
            if (this.mutable) {
                return this.time(_val);
            }
            return datetime(this.value).time(_val);
        }
    });

    Datetime.useStatic({
        unix: function(timestamp){
            return datetime(timestamp * 1000);
        }
    })
}());
