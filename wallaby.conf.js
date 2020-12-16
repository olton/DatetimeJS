module.exports = function (wallaby) {
    return {
        files: [
            'build/**/*.js'
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
