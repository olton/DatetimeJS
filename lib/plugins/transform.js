
(function() {
    'use strict';

    Datetime.use({
        toDateString: function(){
            return this.value.toDateString();
        },

        toISOString: function(){
            return this.value.toISOString();
        },

        toJSON: function(){
            return this.value.toJSON();
        },

        toGMTString: function(){
            return this.value.toGMTString();
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

        toTimeString: function(){
            return this.value.toTimeString();
        },

        toUTCString: function(){
            return this.value.toUTCString();
        },

        toDate: function(){
            return new Date(this.value);
        }
    });
}());
