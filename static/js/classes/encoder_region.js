var EncoderRegion = AbstractRegion.extend(function() {
    return {
        init: function(name) {
            this.name = name;
        },

        /* Public */

        getName: function() {
            return this.name;
        },

        /* Public */

        /* To override
            Note: callbacks params follow Node.js convention of (error, retVal)
        */

        getInput: function(callback) {
            /* Return:
                A list
            */
            callback(null, []);
        },

        getOutput: function(callback) {
            /* Return:
                A list of indices, one for each active column
                    Example: [3, 29, 47, ...]
            */
            callback(null, []);
        },
    };
});
