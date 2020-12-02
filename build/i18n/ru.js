/* eslint-disable */
(function(Datetime) {
    'use strict';

    var locale = {
        months: "Январь Февраль Март Апрель Май Июнь Июль Август Сентябрь Октябрь Ноябрь Декабрь".split(" "),
        monthsShort: "Янв Фев Мар Апр Май Июн Июл Авг Сен Окт Ноя Дек".split(" "),
        weekdays: "Воскресенье Понедельник Вторник Среда Четверг Пятница Суббота".split(" "),
        weekdaysShort: "Вск Пон Втр Срд Чет Пят Суб".split(" "),
        weekdaysTwo: "Вс Пн Вт Ср Чт Пт Сб".split(" ")
    };

    Datetime.locale("ru", locale);
}(Datetime));
/* eslint-enable */
