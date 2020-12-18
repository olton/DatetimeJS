/* global Datetime, datetime */
(function() {
    'use strict';

    Datetime.useStatic({
        min: function(){
            var arr = [].slice.call(arguments);

            return arr.map(function(el){
                return datetime(el);
            }).sort(function(a, b){
                return a.time() - b.time()
            })[0];
        }
    })
}());
