<p align="center">
    <img src="https://metroui.org.ua/res/images/calendar.png" alt="Datetime" height="200">
</p>

<h1 align="center">Datetime.js</h1>

<p align="center">

![Dependencies](https://img.shields.io/badge/Dependencies-none-darklime.svg)
[![Core size](http://img.badgesize.io/olton/DatetimeJS/master/build/datetime.min.js?compression=gzip&label=Core+gzip)](https://github.com/olton/DatetimeJS/blob/master/build/datetime.min.js)
[![Full size](http://img.badgesize.io/olton/DatetimeJS/master/build/datetime.all.min.js?compression=gzip&label=Full+gzip)](https://github.com/olton/DatetimeJS/blob/master/build/datetime.all.min.js)
![GitHub release](https://img.shields.io/github/v/release/olton/DatetimeJS?color=darkLime)
![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat)
![GitHub issues](https://img.shields.io/github/issues-raw/olton/DatetimeJS.svg?color=red)

</p>
<hr>

**Datetime.js** is a minimalist JavaScript library that parses, validates, manipulates, and displays dates and times 
for modern browsers and Node with **comfortable modern API**.

* 🕒 Quick and accurate
* 💪 Immutable/mutable modes
* 🔥 Chainable
* 🌐 I18n support
* 📦 2kb mini library (in base), 6kb - with all plugins
* 👫 All browsers, Electron, NodeJS supported

## Getting started

### Documentation

You can find for more details, API, and other docs on [DOCUMENTATION](DOCUMENTATION.md).

### Installation
In HTML
```html
<script src="datetime.js"></script>
```
For NodeJS or use with Webpack or modern JS
```console
npm install @olton/datetime --save
```

### API

It's easy to use Datetime APIs to parse, validate, manipulate, and display dates and times.

#### Parse
```javascript
datetime();
datetime("2020");
datetime("2020-12-31");
datetime("2020-12-31 23:59");
datetime(2020, 12, 31, 23, 59);
datetime([2020, 12, 31, 23, 59]);
Datetime.parse("Mon, 25 Dec 1995 13:30:00 +0430"); // Work same as Date.parse()
Datetime.fromString("16 November 1961 15:24", "dd mm %y h:i", "en")
Datetime.fromString("16 Ноября 1961 15:24", "dd mm %y h:i", "ru")
```

#### Immutable/mutable
By default, datetime object is mutable. But, You can create **immutable** variable with method `immutable`:

```javascript
var immutableDate = datetime('2020-12-21').immutable();
console.log(immutableDate); // 2020-12-21
console.log(immutableDate.add(1, 'month')); // 2021-01-21 this is a new object
console.log(immutableDate); // 2020-12-21
```

and return to `mutable` state
```javascript
immutableDate.immutable(false); // now immutableDate works as mutable object
```

#### Display
```javascript
datetime().format('{YYYY} MM-DDTHH:mm:ss sss Z A');
datetime().strftime('{%Y} %n-%dT%H:%M:%S %Q %z %p');
```

#### Get & set
You can set and get: `ms`, `second`, `minute`, `hour`, `day`, `month`, `year`, `time` (timestamp), ... 
```javascript
datetime().set('month', 3).month();
datetime().month(3).month();
```

#### Manipulate
You can set: `ms`, `second`, `minute`, `hour`, `day`, `month`, `year`.
```javascript
datetime().add(3, 'day').add(1, 'hour');
datetime().addDay(3).addHour(1);
```

#### Align (Start From)
You can align date to: `second`, `minute`, `hour`, `day`, `month`, `year`, `quarter`, `week`, `isoWeek`.
```javascript
datetime().align("year"); // Will alignment to 1st Jan of year
datetime().align("month"); // Will alignment to 1st day of month
```

#### Compare
```javascript
datetime("2020").older("2021"); // return true
datetime("2020").younger("1972"); // return true
datetime("2020").between("2019", "2021"); // return true
datetime("2020-21-12").diff("1972-21-12"); // return {day: 17532, hour: 420768, millisecond: 1514764800000, minute: 25246080, month: 576, second: 1514764800, year: 48}
datetime("2020-21-12").distance("1972-21-12", "year"); // return 48
```

#### Information
You can get different additional information about your date: `count days in month`, `count days in year`, `number of quarter`, `year is leap`, ...  
```javascript
datetime("2020-12-21").dayOfYear(); // return 356
datetime("2020-02-01").daysInMonth(); // return 29
datetime("2020-02-01").quarter(); // return 1
datetime("2020").isLeapYear(); // return true
```

### i18n
`Datetime` has great support for internationalization. By default, Datetime includes only **english** locale.
You can include many others:

In HTML
```html
<script src="/DATETIME_DIR/datetime.js"></script>
<script src="/DATETIME_DIR/i18n/ru.js"></script>
```
For NodeJS or use with Webpack or modern JS
```javascript
import "@olton/datetime";
import "@olton/datetime/i18n/ru";
```

With locales:
```javascript
Datetime.fromString("16 Ноября 1961 15:24", "dd mm %y h:i", "ru");
datetime().useLocale('ru').format("DD MMM YYYY"); // 03 Дек 2020
```

### Plugins
You can create plugin and register it with functions `Datetime.use()` and `Datetime.useStatic()`:

Create plugin
```javascript
(function(global) {
    'use strict';

    Datetime.use({
        prototypeTest: function(val){
            return 0 === val || val ? val : "test";
        }
    });

    Datetime.useStatic({
        staticTest: function(val){
            return 0 === val || val ? val : "static test";
        }
    });
}());
```

Include a plugin into page after `datetime.js`:
```html
<script sec="datetime.js"></script>
<script sec="plugin.js"></script>
```

And now use plugin:
```html
<!-- Prototype methods -->
console.log(datetime().prototypeTest());
console.log(datetime().prototypeTest(123));

<!-- static methods  -->
console.log(Datetime.staticTest());
console.log(Datetime.staticTest(456));
```

## Sponsors
No sponsor yet :(

## License

Datetime is licensed under a [MIT license](LICENSE).
