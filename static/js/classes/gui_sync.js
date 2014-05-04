/* Keeps Visualizations in sync */
var GUISync = Fiber.extend(function() {
    return {
        init: function(master) {
            this.master = master;
            this.children = [];

            this._listenForEvents();
        },

        addChild: function(child) {
            this.children.push(child);
            this._disableControllers(child);
        },

        /* Private */

        _listenForEvents: function() {
            var self = this;

            var fn = this.master.iterationChanged,
                newFn = function () {
                    fn();
                    self._iterationChanged();
                }

            this.master.iterationChanged = newFn;
        },

        _disableControllers: function(child) {
            child._disableController('iteration');
            child._disableController('play');
            child._disableController('speed');
            child._disableController('next');
            child._disableController('prev');
        },

        _iterationChanged: function() {
            for (var i = 0; i < this.children.length; i++) {
                this.children[i].iteration = this.master.iteration;
            }
        },
    };
});
