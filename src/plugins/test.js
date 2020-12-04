/* eslint-disable */
(function(global) {
    'use strict';

    Datetime.use({
        test: function(val){
            return 0 === val || val ? val : "test";
        }
    });

    Datetime.useStatic({
        test: function(val){
            return 0 === val || val ? val : "static test";
        }
    });
}(typeof self === "undefined" ? typeof global === "undefined" ? window : global : self));
/* eslint-enable */
