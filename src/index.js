(function(global) {
    'use strict';

    var datetime = function(){
        var args = [].slice.call(arguments);
        return new (Function.prototype.bind.apply(Datetime,  [this].concat(args) ) );
    }

    var Datetime = function(){
        var args = [].slice.call(arguments);
        this.value = new (Function.prototype.bind.apply(Date,  [this].concat(args) ) );
    }

    Datetime.prototype = {

        year2: function(){
            return this.value.getFullYear().toString().substr(-2);
        },

        val: function(){
            return this.value;
        },

        valueOf: function(){
            return this.value.getTime();
        },

        /* Get + Set */
        millisecond: function(val){
            if (!arguments.length) {
                return this.value.getMilliseconds();
            }

            this.value.setMilliseconds(val);
            return this;
        },

        second: function(val){
            if (!arguments.length) {
                return this.value.getSeconds();
            }

            var _val = +val;
            var minutes = parseInt(_val / 60 );
            var seconds = _val % 60;

            this.value.setSeconds(seconds);
            if (minutes) {
                this.minute(minutes);
            }

            return this;
        },

        minute: function(val){
            if (!arguments.length) {
                return this.value.getMinutes();
            }

            var _val = +val;
            var hours = parseInt(_val / 60 );
            var minutes = _val % 60;

            this.value.setMinutes(minutes);
            if (hours) {
                this.hour(hours);
            }

            return this;
        },

        hour: function(val){
            if (!arguments.length) {
                return this.value.getHours();
            }

            var _val = +val;
            var days = parseInt(_val / 24 );
            var hours = _val % 24;

            this.value.setHours(hours);
            if (days) {
                this.date(days);
            }

            return this;
        },

        date: function(val){
            if (!arguments.length) {
                return this.value.getDate();
            }

            return this;
        },

        get: function(unit){
            switch (unit) {
                case "date":
                case "D": return this.date();

                case "day":
                case "d": return this.day();

                case "month":
                case "M": return this.month();

                case "year":
                case "y": return this.year();

                case "hour":
                case "h": return this.hour();

                case "minute":
                case "m": return this.minute();

                case "second":
                case "s": return this.second();

                case "millisecond":
                case "ms": return this.millisecond();

                default: return this.valueOf();
            }
        },

        set: function(unit, val){

        }
    }

    global.Datetime = Datetime;
    global.datetime = datetime;

}(window));
/* eslint-enable */