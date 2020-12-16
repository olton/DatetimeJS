
(function() {
    'use strict';

    var fnAlign = Datetime.align;
    var fnAlignEnd = Datetime.alignEnd;

    Datetime.useStatic({
        align: function(d, align){
            var date = d instanceof Datetime ? d : datetime(d),
                result;

            switch(align) {
                case "quarter":  result = Datetime.align(date, 'day').day(1).month(date.quarter() * 3 - 3); break; //quarter
                default: result = fnAlign.apply(this, [date, align]);
            }

            return result;
        },

        alignEnd: function(d, align){
            var date = d instanceof Datetime ? d : datetime(d),
                result;

            switch(align) {
                case "quarter":  result = Datetime.align(date, 'quarter').add(3, 'month').add(-1, 'ms'); break; //quarter
                default: result = fnAlignEnd.apply(this, [date, align]);
            }

            return result;
        }
    })

    Datetime.use({
        quarter: function(){
            var month = this.month();

            if (month <= 2) return 1;
            if (month <= 5) return 2;
            if (month <= 8) return 3;
            return 4;
        }
    })
}());
