
(function() {
    'use strict';

    Datetime.useStatic({
        sort: function(arr, opt){
            var result, _arr;
            var o = typeof opt === "object"  ? opt : {};

            if (typeof o.format === "undefined") o.format = Datetime.DEFAULT_FORMAT;
            if (typeof o.dir === "undefined") o.dir = "ASC";
            if (typeof o.returnAs === "undefined") o.returnAs = "datetime";

            _arr =  arr.map(function(el){
                return datetime(el);
            }).sort(function(a, b){
                return a.valueOf() - b.valueOf();
            });

            if (o.dir === "DESC") {
                _arr.reverse();
            }

            switch (o.returnAs) {
                case "string":
                    result = _arr.map(function(el){
                        return el.format(o.format)
                    });
                    break;
                case "date":
                    result = _arr.map(function(el){
                        return el.val();
                    });
                    break;

                default: result = _arr;
            }

            return result;
        }
    })
}());
