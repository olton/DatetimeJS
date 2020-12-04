/* eslint-disable */
(function(global) {
    'use strict';

    Datetime.use({
        test: function(val){
            if (val !== 0 && !val) {
                return "test";
            }

            return val;
        }
    });

    Datetime.useStatic({
        test: function(val){
            if (val !== 0 && !val) {
                return "static test";
            }

            return val;
        }
    });
}(typeof self === "undefined" ? typeof global === "undefined" ? window : global : self));
/* eslint-enable */
