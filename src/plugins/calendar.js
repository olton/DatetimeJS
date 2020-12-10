/* global Datetime, datetime */
(function() {
    'use strict';

    Datetime.use({
        calendar: function(iso){
            return Datetime.calendar(this, iso);
        }
    });

    Datetime.useStatic({
        calendar: function(d, iso){
            var date = d instanceof Datetime ? d.clone().align("month") : datetime(d);
            var ws = iso === 0 || iso ? iso : date.weekStart;
            var wd = ws ? date.isoWeekDay() : date.weekDay();
            var names = Datetime.getNames(date.locale);

            var getWeekDays = function (wd, ws){
                if (ws === 0) {
                    return wd;
                }
                var su = wd[0];
                return wd.slice(1).concat([su]);
            }

            var result = {
                month: names.months[date.month()],
                days: [],
                weekstart: iso ? 1 : 0,
                weekdays: getWeekDays(names.weekdaysMin,ws),
                today: datetime().format("YYYY-MM-DD"),
                weekends: []
            };

            date.addDay(ws ? -wd+1 : -wd);

            for(var i = 0; i < 42; i++) {
                result.days.push(date.format("YYYY-MM-DD"));
                date.add(1, 'day');
            }

            result.weekends = result.days.filter(function(v, i){
                var def = [0,6,7,13,14,20,21,27,28,34,35,41];
                var iso = [5,6,12,13,19,20,26,27,33,34,40,41];

                return ws === 0 ? def.indexOf(i) > -1 : iso.indexOf(i) > -1;
            });

            return result;
        }
    });
}());
