
(function() {
    'use strict';

    Datetime.useStatic({
        max: function(){
            var arr = [].slice.call(arguments);

            return arr.map(function(el){
                return datetime(el);
            }).sort(function(a, b){
                return b.time() - a.time()
            })[0];
        }
    })
}());
