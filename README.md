# Datetime

Datetime.js is a minimalist JavaScript library that parses, validates, manipulates, and displays dates and times for modern browsers with comfortable modern API.

* 🕒 Quick and accurate
* 🔥 Chainable
* 🌐 I18n support
* 📦 3kb mini library
* 👫 All browsers supported

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
Datetime.parse(...);
Datetime.fromString("16 November 1961 15:24", "dd mm %y h:i", "en")
Datetime.fromString("16 Ноября 1961 15:24", "dd mm %y h:i", "ru")
```

#### Display
```javascript
datetime().format('{YYYY} MM-DDTHH:mm:ss sss Z A');
datetime().strftime('{%Y} %n-%dT%H:%M:%S %Q %z %p');
```

#### Get & set
```javascript
datetime().set('month', 3).month();
datetime().month(3).month();
```

#### Manipulate
```javascript
datetime().add(3, 'day').add(1, 'hour');
datetime().addDay(3).addHour(1);
```

#### Align (Start From)
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
<script src="datetime.js"></script>
<script src="i18n/ru.js"></script>
```
For NodeJS or use with Webpack or modern JS
```javascript
import "@olton/datetime";
import "@olton/i18n/ru";
```

With locales:
```javascript
Datetime.fromString("16 Ноября 1961 15:24", "dd mm %y h:i", "ru");
datetime().useLocale('ru').format("DD MMM YYYY"); // 03 Дек 2020
```

### Plugins
In develop...

## Sponsors
No sponsor yet :(

## License

Datetime is licensed under a [MIT license](LICENSE).