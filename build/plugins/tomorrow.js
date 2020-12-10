/* global Datetime, datetime */
(function() {
    'use strict';

    Datetime.useStatic({
        isTomorrow: function(date){
            var d = (date instanceof  Datetime ? date.clone() : datetime(date)).align("day");
            var c = datetime().align('day').add(1, 'day');

            return d.time() === c.time();
        }
    });

    Datetime.use({
        isTomorrow: function(){
            return Datetime.isTomorrow(this);
        }
    });
}());
