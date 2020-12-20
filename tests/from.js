let assert = require('assert');
let chai = require('chai');
let expect = chai.expect;

require('../src/index');
require('../src/plugins/from');
require('../src/i18n/ru');

let str = "21 Dec 1972 06:12:54.321";
let str2 = "21-12-1972 06:12:54.321";
let str3 = "21-13-1972 06:12:54.321";
let date = datetime();

describe('Parse date from string', function() {
    it ('Should be true', () => {
        assert.strictEqual(Datetime.from("21 Dec 1972", "DD MM YYYY") instanceof Datetime, true);
    })
    it ('Should be true', () => {
        assert.strictEqual(Datetime.from(str) instanceof Datetime, true);
    })
    it ('Should be equal', () => {
        assert.strictEqual(Datetime.from(str, "DD MM").year(), 1900);
    })
    it ('Should be 11', () => {
        assert.strictEqual(Datetime.from(str, "DD MM YYYY").month(), 11);
    })
    it ('Should be 21', () => {
        assert.strictEqual(Datetime.from(str, "DD MM YYYY").day(), 21);
    })
    it ('Should be 321', () => {
        assert.strictEqual(Datetime.from(str, "DD MM YYYY hh:mm:ss:sss").ms(), 321);
    })
    it ('Should be 1972', () => {
        assert.strictEqual(Datetime.from(str2, "DD-MM-YYYY").year(), 1972);
    })
    it ('Should be ...', () => {
        assert.strictEqual(Datetime.from("21 1972 12", "DD YYYY MM").year(), 1972);
        assert.strictEqual(Datetime.from("21 1972 12", "DD YYYY MM").day(), 21);
        assert.strictEqual(Datetime.from("21 1972 12", "DD YYYY MM").month(), 11);
        assert.strictEqual(Datetime.from("21 1972 12", "DD YYYY MM").day(), 21);
    })
    it ('Should be 11', () => {
        assert.strictEqual(Datetime.from("21 1972 13", "DD YYYY MM").month(), 0);
        assert.strictEqual(Datetime.from("21 1972 Dex", "DD YYYY MM").month(), 0);
        assert.strictEqual(Datetime.from("21 1972", "DD YYYY MM").month(), 0);
    })
    it ('Should be 11', () => {
        assert.strictEqual(Datetime.from("1972 12", "YYYY MM").month(), 11);
    })
    it ('Should be 17', () => {
        assert.strictEqual(Datetime.from("17:53:26", "HH:MI:SS").hour(), 17);
    })
    it ('Should be 53', () => {
        assert.strictEqual(Datetime.from("17:53:26", "HH:MI:SS").minute(), 53);
    })
    it ('Should be 26', () => {
        assert.strictEqual(Datetime.from("17:53:26", "HH:MI:SS").second(), 26);
    })
    it ('Should be 26', () => {
        assert.strictEqual(Datetime.from("21 Декабря 1972", "DD MM YYYY", "ru").month(), 11);
    })
    it ('Should be INVALID', () => {
        expect(() => {Datetime.from("::", "DD MM YYYY")}).to.throw(Datetime.INVALID_DATE);
    })
})