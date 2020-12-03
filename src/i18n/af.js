/* eslint-disable */
(function(Datetime) {
    'use strict';

    var locale = {
        months: "Januarie Februarie Maart April Mei Junie Julie Augustus September Oktober November Desember".split(" "),
        monthsShort: "Jan Feb Mrt Apr Mei Jun Jul Aug Sep Okt Nov Des".split(" "),
        weekdays: "Sondag Maandag Dinsdag Woensdag Donderdag Vrydag Saterdag".split(" "),
        weekdaysShort: "Son Maa Din Woe Don Vry Sat".split(" "),
        weekdaysTwo: "So Ma Di Wo Do Vr Sa".split(" "),
        weekStart: 1
    };

    Datetime.locale("af", locale);
}(Datetime));
/* eslint-enable */