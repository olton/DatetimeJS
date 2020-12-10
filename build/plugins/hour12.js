/* global Datetime */
(function() {
    'use strict';

    Datetime.use({
        ampm: function(isLowerCase){
            var val = this.hour() < 12 ? "AM" : "PM";
            return isLowerCase ? val.toLowerCase() : val;
        },

        hour12: function(h, /* string am|pm */ p){
            var hour = h;

            if (arguments.length === 0) {
                return this.hour() % 12 || 12;
            }

            p = p || 'am';

            if (p.toLowerCase() === "pm") {
                hour += 12;
            }

            return this.hour(hour);
        }
    })
}());
