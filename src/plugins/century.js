/* global Datetime */
(function() {
    'use strict';

    Datetime.use({
        century: function(){
            return parseInt(this.year() / 100);
        }
    })
}());
