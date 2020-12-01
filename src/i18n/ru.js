/* eslint-disable */
(function(Datetime) {
    'use strict';

    var locale = {
        months: "January February March April May June July August September October November December".split(" "),
        monthsShort: "Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" "),
        weekdays: "Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" "),
        weekdaysShort: "Sun Mon Tue Wed Thu Fri Sat".split(" "),
        weekdaysTwo: "Su Mo Tu We Th Fr Sa".split(" ")
    };

    Datetime.locale("ru", locale);
}(Datetime));
/* eslint-enable */
