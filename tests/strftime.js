let assert = require('assert');

require('../src/index');
require('../src/plugins/hour12');
require('../src/plugins/century');
require('../src/plugins/dayofyear');
require('../src/plugins/isleapyear');
require('../src/plugins/weeknumber');
require('../src/plugins/iso');
require('../src/plugins/timezone');
require('../src/plugins/transform');
require('../src/plugins/strftime');

describe('Datetime test template', function() {
    it ('Should be true', () => {
        assert.strictEqual(datetime("2020-12-21").strftime(), '2020-12-21T02:00:00.000+02:00');
    })
    it ('Should be true', () => {
        assert.strictEqual(datetime("2020-12-21").strftime("%d-%m-%Y"), '21-12-2020');
    })
    it ('Should be true', () => {
        assert.strictEqual(datetime("2020-12-21").strftime("%d-%m-%Y %1"), '21-12-2020 %1');
    })
})