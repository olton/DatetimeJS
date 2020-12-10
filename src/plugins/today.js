/* global Datetime, datetime */
(function() {
    'use strict';

    Datetime.use({
        isToday: function(d){
            var curr = this.clone().align('day');
            var date = datetime(d).align('day');

            return curr.time() === date.time();
        }
    })
}());
