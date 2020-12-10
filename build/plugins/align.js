/* global Datetime, datetime */
(function() {
    'use strict';

    Datetime.useStatic({
        align: function(d, align, asDate){
            var date = datetime(d), result, temp;
            switch (align) {
                case "second":  result = date["millisecond"](0); break; //second
                case "minute":  result = date["millisecond"](0)["second"](0); break; //minute
                case "hour":  result = date["millisecond"](0)["second"](0)["minute"](0); break; //hour
                case "day":  result = date["millisecond"](0)["second"](0)["minute"](0)["hour"](0); break; //day
                case "month":  result = date["millisecond"](0)["second"](0)["minute"](0)["hour"](0)["day"](1); break; //month
                case "year":  result = date["millisecond"](0)["second"](0)["minute"](0)["hour"](0)["day"](1)["month"](0); break; //year
                case "quarter":  result = date["millisecond"](0)["second"](0)["minute"](0)["hour"](0)["day"](1)["month"](date.quarter() * 3 - 3); break; //quarter
                case "week":  {
                    temp = date.weekDay();
                    result = date["millisecond"](0)["second"](0)["minute"](0)["hour"](0).addDay(-temp);
                    break; // week
                }
                case "isoWeek": {
                    temp = date.weekDay();
                    result = date["millisecond"](0)["second"](0)["minute"](0)["hour"](0).addDay(-temp + 1);
                    break; // isoWeek
                }
                default:   result = date;
            }
            return asDate ? result.val() : result;
        }
    })

    Datetime.use({
        align: function(align){
            if (this.mutable) {
                this.value = Datetime.align(this.value, align, true);
                return this;
            }

            return this.clone().align(align);
        }
    })
}());
