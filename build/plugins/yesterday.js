/* global Datetime, datetime */
(function() {
    'use strict';

    Datetime.useStatic({
        isYesterday: function(date){
            var d = (date instanceof  Datetime ? date.clone() : datetime(date)).align("day");
            var c = datetime().align('day').add(-1, 'day');

            return d.time() === c.time();
        }
    });

    Datetime.use({
        isYesterday: function(){
            return Datetime.isYesterday(this);
        }
    })
}());
