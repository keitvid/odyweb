/**
 * Created by AGromov on 23.08.2016.
 */

define([], function() {
    var state = {};
    return {
        setState: function(key, value) {
            state[key] = value;
        },

        getState: function(key) {
            return state[key];
        }
    }
});