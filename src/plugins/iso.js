/* global Datetime */
(function() {
    'use strict';

    Datetime.use({
        isoWeekDay: function(val){
            if (!arguments.length || (Datetime.not(val))) {
                return (this.weekDay() + 6) % 7 + 1;
            }

            return this.weekDay((val + 6) % 7 + 1);
        },

        isoWeekNumber: function(){
            return this.weekNumber(1);
        }
    })
}());
