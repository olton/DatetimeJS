/* global Datetime, datetime */
(function() {
    'use strict';

    Datetime.useStatic({
        parseFromString: function(str, format, locale){
            var norm, normFormat, fItems, dItems;
            var iMonth, iDay, iYear, iHour, iMinute, iSecond;
            var year, month, day, hour, minute, second;
            var parsedMonth;

            var getIndex = function(where, what){
                return where.map(function(el){
                    return el.toLowerCase();
                }).indexOf(what.toLowerCase());
            }

            var monthNameToNumber = function(month){
                var i = -1;
                var names = Datetime.getNames(locale || 'en');

                if (Datetime.not(month)) return -1;

                i = getIndex(names.months, month);

                if (i === -1 && typeof names["monthsParental"] !== "undefined") {
                    i = getIndex(names.monthsParental, month);
                }

                if (i === -1) {
                    month = month.substr(0, 3);
                    i = getIndex(names.monthsShort, month);
                }

                return i === -1 ? -1 : i + 1;
            };

            var getPartIndex = function(part){
                var parts = {
                    "month": ["M", "mm", "%m"],
                    "day": ["D", "dd", "%d"],
                    "year": ["YY", "YYYY", "yy", "yyyy", "%y"],
                    "hour": ["h", "hh", "%h"],
                    "minute": ["m", "mi", "i", "ii", "%i"],
                    "second": ["s", "ss", "%s"]
                }

                var result = -1, key, index;

                if (!parts[part]) {
                    return result;
                }

                for(var i = 0; i < parts[part].length; i++) {
                    key = parts[part][i];
                    index = fItems.indexOf(key);
                    if (index !== -1) {
                        result = index;
                        break;
                    }
                }

                return result;
            }

            if (Datetime.not(format) || (""+format).trim() === "") {
                return datetime();
            }

            /* eslint-disable-next-line */
            norm = str.replace(/[\/,.:\s]/g, '-');
            /* eslint-disable-next-line */
            normFormat = format.toLowerCase().replace(/[^a-zA-Z0-9%]/g, '-');
            fItems = normFormat.split('-');
            dItems = norm.split('-');

            if (norm.replace(/-/g,"").trim() === "") {
                return Datetime.INVALID_DATE;
            }

            iMonth = getPartIndex("month");
            iDay = getPartIndex("day");
            iYear = getPartIndex("year");
            iHour = getPartIndex("hour");
            iMinute = getPartIndex("minute");
            iSecond = getPartIndex("second");

            if (iMonth > -1 && dItems[iMonth] !== "") {
                if (isNaN(parseInt(dItems[iMonth]))) {
                    dItems[iMonth] = monthNameToNumber(dItems[iMonth]);
                    if (dItems[iMonth] === -1) {
                        return Datetime.INVALID_DATE;
                    }
                } else {
                    parsedMonth = parseInt(dItems[iMonth]);
                    if (parsedMonth < 1 || parsedMonth > 12) {
                        return Datetime.INVALID_DATE;
                    }
                }
            } else {
                return Datetime.INVALID_DATE;
            }

            year  = iYear > -1 && dItems[iYear] ? dItems[iYear] : null;
            month = iMonth > -1 && dItems[iMonth] ? dItems[iMonth] : null;
            day   = iDay > -1 && dItems[iDay] ? dItems[iDay] : null;

            hour    = iHour > -1 && dItems[iHour] ? dItems[iHour] : null;
            minute  = iMinute > -1 && dItems[iMinute] ? dItems[iMinute] : null;
            second  = iSecond > -1 && dItems[iSecond] ? dItems[iSecond] : null;

            return datetime(year, month-1, day, hour, minute, second);
        }
    })

}());
