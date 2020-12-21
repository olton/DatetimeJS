
(function() {
    'use strict';

    Datetime.useStatic({
        sort: function(arr, opt){
            var result, _arr;
            var o = {};

            if (typeof opt === "string" || typeof opt !== "object" || Datetime.not(opt)) {
                o.format = Datetime.DEFAULT_FORMAT;
                o.dir = opt && opt.toUpperCase() === "DESC" ? "DESC" : "ASC";
                o.returnAs = "datetime";
            } else {
                o.format = opt.format || Datetime.DEFAULT_FORMAT;
                o.dir = (opt.dir || "ASC").toUpperCase();
                o.returnAs = opt.format ? "string" : opt.returnAs || "datetime";
            }

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
