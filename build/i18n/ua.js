/* eslint-disable */
(function(Datetime) {
    'use strict';

    var locale = {
        months: "Січень Лютий Березень Квітень Травень Червень Липень Серпень Вересень Жовтень Листопад Грудень".split(" "),
        monthsParental: "Січня Лютого Березеня Квітня Травня Червня Липня Серпня Вересня Жовтня Листопада Грудня".split(" "),
        monthsShort: "Січ Лют Бер Кві Тра Чер Лип Сер Вер Жов Лис Гру".split(" "),
        weekdays: "Неділя Понеділок Вівторок Середа Четвер П'ятниця Субота".split(" "),
        weekdaysShort: "Нед Пон Вів Сер Чет Птн Суб".split(" "),
        weekdaysMin: "Нд Пн Вт Ср Чт Пт Сб".split(" "),
        weekStart: 1
    };

    Datetime.locale("ua", locale);
}(Datetime));
/* eslint-enable */
