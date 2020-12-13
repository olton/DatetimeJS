/* global Datetime */
(function() {
    'use strict';

    Datetime.use({
        decade: function(){
            return Math.floor(this.year()/10) * 10;
        },

        decadeStart: function(){
            var decade = this.decade();
            var result = this.mutable ? this : this.clone();

            return result.year(decade).month(0).day(1);
        },

        decadeEnd: function(){
            var decade = this.decade() + 9;
            var result = this.mutable ? this : this.clone();

            return result.year(decade).month(11).day(31);
        },

        decadeOfMonth: function(){
            var part = this.clone().add(1, "month").day(1).add(-1, 'day').day() / 3;
            var day = this.day();

            if (day <= part) return 1;
            if (day <= part * 2) return 2;
            return 3;
        }
    })
}());
