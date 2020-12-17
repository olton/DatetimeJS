/* global Datetime */
(function() {
    'use strict';

    Datetime.use({
        toTimeString: function(){
            return this.value.toTimeString();
        },

        toLocaleDateString: function(){
            return this.value.toLocaleDateString();
        },

        toLocaleString: function(){
            return this.value.toLocaleString();
        },

        toLocaleTimeString: function(){
            return this.value.toLocaleTimeString();
        },

        toJSON: function(){
            return this.value.toJSON();
        },

        toSource: function(){
            return this.value.toSource();
        },

        toISOString: function(){
            return this.value.toISOString();
        },

        toUTCString: function(){
            return this.value.toUTCString();
        },

        toDate: function(){
            return new Date(this.value);
        }
    });
}());
