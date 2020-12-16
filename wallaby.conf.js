module.exports = function (wallaby) {
    return {
        files: [
            'src/*.js',
            'src/plugins/*.js',
            'src/i18n/*.js',
        ],

        tests: [
            'tests/**/*.js'
        ],

        env: {
            type: 'node'
        },

        testFramework: 'mocha'
    };
};
