/* eslint-disable */
(function(Datetime) {
    'use strict';

    var locale = {
        months: "Januar Februar März April Mai Juni Juli August September Oktober November Dezember".split(" "),
        monthsShort: "Jan Feb Mär Apr Mai Jun Jul Aug Sep Okt Nov Dez".split(" "),
        weekdays: "Sonntag Montag Dienstag Mittwoch Donnerstag Freitag Samstag".split(" "),
        weekdaysShort: "Son Mon Die Mit Don Fre Sam".split(" "),
        weekdaysMin: "So Mo Di Mi Do Fr Sa".split(" "),
        weekStart: 1
    };

    Datetime.locale("de", locale);
}(Datetime));
/* eslint-enable */