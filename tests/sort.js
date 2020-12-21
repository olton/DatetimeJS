let assert = require('assert');

require('../src/index');
require('../src/plugins/sort');

describe('Datetime test template', function() {
    it ('Should be true', () => {
        assert.strictEqual(Datetime.sort(["2020", "2021", "1972"])[0].year(), 1972);
    })
    it ('Should be true', () => {
        assert.strictEqual(Datetime.sort(["2020", "2021", "1972"], "desc")[0].year(), 2021);
    })
    it ('Should be true', () => {
        assert.strictEqual(Datetime.sort(["2020", "2021", "1972"], {})[0].year(), 1972);
        assert.strictEqual(Datetime.sort(["2020", "2021", "1972"], {dir: "asc"})[0].year(), 1972);
        assert.strictEqual(Datetime.sort(["2020", "2021", "1972"], {dir: "desc"})[0].year(), 2021);
        assert.strictEqual(Datetime.sort(["2020", "2021", "1972"], {format: "YYYY"})[0], '1972');
        assert.strictEqual(Datetime.sort(["2020", "2021", "1972"], {returnAs: "date"})[0].getFullYear(), 1972);
    })
})