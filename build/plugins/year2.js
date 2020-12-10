/* global Datetime */
(function() {
    'use strict';

    Datetime.use({
        year2: function(){
            return (""+this.year()).substr(-2);
        }
    })
}());
