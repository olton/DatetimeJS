/* global Datetime, datetime */
(function() {
    'use strict';

    Datetime.use({
        isTomorrow: function(d){
            var curr = this.clone().align('day').addDay(1);
            var date = datetime(d).align('day');

            return curr.time() === date.time();
        }
    })
}());
