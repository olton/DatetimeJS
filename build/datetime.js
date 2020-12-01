/*
 * Datetime v0.1.0, (https://github.com/olton/Datetime.git)
 * Copyright 2020 by Serhii Pimenov
 * Immutable date-time library with the modern API
 * Licensed under MIT
 */


// Source: src/index.js

/* eslint-disable */
(function(global) {
    'use strict';

    var datejs = function(){
        var args = [].slice.call(arguments);
        return new (Function.prototype.bind.apply(DateJS,  [this].concat(args) ) );
    }

    var DateJS = function(){
        var args = [].slice.call(arguments);
        this.value = new (Function.prototype.bind.apply(Date,  [this].concat(args) ) );
    }

    var M = {
        ms: "Milliseconds",
        s: "Seconds",
        m: "Minutes",
        h: "Hours",
        d: "Date",
        D: "Day",
        M: "Months",
        Y: "FullYear",
        y: "Year",
        w: "Week",
        Q: "Quarter"
    }

    DateJS.prototype = {

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

        _set: function(m, v){
            this.value["set"+M[m]](v);
            return this;
        },

        _get: function(m){
            return this.value["get"+M[m]]();
        },

        _work: function(part, val){
            if (arguments.length === 1) {
                return this._get(part);
            }
            return this._set(part, val);
        },

        millisecond: function(val){
            return this._work("ms", val);
        },

        second: function(val){
            return this._work("s", val);
        },

        minute: function(val){
            return this._work("m", val);
        },

        hour: function(val){
            return this._work("h", val);
        },

        day: function(val){
            return this._work("D", val);
        },

        date: function(val){
            return this._work("d", val);
        },

        month: function(val){
            return this._work("M", val);
        },

        year: function(val){
            return this._work("Y", val);
        },

        get: function(unit){
            switch (unit) {
                case "date":
                case "d": return this.date();

                case "day":
                case "D": return this.day();

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

    global.DateJS = DateJS;
    global.datejs = datejs;

}(window));
/* eslint-enable */