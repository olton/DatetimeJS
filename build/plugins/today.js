/* global Datetime, datetime */
(function() {
    'use strict';

    Datetime.useStatic({
        isToday: function(date){
            var d = (date instanceof  Datetime ? date.clone() : datetime(date)).align("day");
            var c = datetime().align('day');

            return d.time() === c.time();
        }
    })

    Datetime.use({
        isToday: function(){
            return Datetime.isToday(this);
        }
    })
}());
