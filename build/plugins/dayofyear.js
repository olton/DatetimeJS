/* global Datetime */
/*
* Plugin required isleapyear.js
* */
(function() {
    'use strict';

    Datetime.use({
        dayOfYear: function(){
            var dayCount = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
            var month = this.month();
            var day = this.day();
            return dayCount[month] + day + ((month > 1 && this.isLeapYear()) ? 1 : 0);
        }
    })
}());
