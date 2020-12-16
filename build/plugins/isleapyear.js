
(function() {
    'use strict';

    Datetime.use({
        isLeapYear: function(){
            var year = this.year();
            return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
        }
    })
}());
