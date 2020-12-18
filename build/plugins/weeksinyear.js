/* global Datetime */
(function() {
    'use strict';

    Datetime.use({
        weeksInYear: function(weekStart){
            var curr = this.clone();
            return curr.month(11).day(31).weekNumber(weekStart);
        }
    })
}());
