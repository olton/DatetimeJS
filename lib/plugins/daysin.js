
(function() {
    'use strict';

    Datetime.use({
        daysInMonth: function(){
            var curr = datetime(this.value);
            return curr.add(1, 'month').day(1).add(-1, 'day').day();
        },

        daysInYear: function(){
            return this.isLeapYear() ? 366 : 365;
        },

        daysInYearMap: function(){
            var result = [];
            var curr = datetime(this.value);

            curr.month(0).day(1);

            for(var i = 0; i < 12; i++) {
                curr.add(1, 'month').add(-1, 'day');
                result.push(curr.day());
                curr.day(1).add(1, 'month');
            }
            return result;
        },

        daysInYearObj: function(locale, shortName){
            var map = this.daysInYearMap();
            var result = {};
            var names = Datetime.getLocale(locale || this.locale);

            map.forEach(function(v, i){
                result[names[shortName ? 'monthsShort' : 'months'][i]] = v;
            });

            return result;
        }
    })
}());
