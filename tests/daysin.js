let assert = require('assert');

require('../src/index');
require('../src/plugins/daysin');
require('../src/plugins/isleapyear');
require('../src/i18n/ru');

describe('DaysIn plugin test', function() {
    it ('Should be 29', () => {
        assert.strictEqual(datetime("2020-2").daysInMonth(), 29);
    })
    it ('Should be 366', () => {
        assert.strictEqual(datetime("2020-2").daysInYear(), 366);
    })
    it ('Should be 365', () => {
        assert.strictEqual(datetime("2021-2").daysInYear(), 365);
    })
    it ('Should be ', () => {
        assert.strictEqual(datetime("2021-2").daysInYearMap().length, 12);
    })
    it ('Should be ', () => {
        assert.strictEqual(datetime("2021-2").daysInYearObj().February, 28);
    })
    it ('Should be ', () => {
        assert.strictEqual(datetime("2021-2").daysInYearObj('ru', true)['Фев'], 28);
    })
})