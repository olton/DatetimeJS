# Datetime

Datetime.js is a minimalist JavaScript library that parses, validates, manipulates, and displays dates and times for modern browsers with comfortable modern API.

* 🕒 Familiar Moment.js API & patterns
* 🔥 Chainable
* 🌐 I18n support
* 📦 3kb mini library
* 👫 All browsers supported

## Getting started

### Documentation

You can find for more details, API, and other docs on [DOCUMENTATION](DOCUMENTATION.md).

### Installation

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

```