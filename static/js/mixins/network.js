var NetworkMixin = function(base) {
    return  {
        getJSON: function(path, callback) {
            $.getJSON(this.modelURL + "/" + path + "?callback=?", function(data) {
                callback(null, data);
            });
        }
    };
};
