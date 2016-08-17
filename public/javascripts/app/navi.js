/**
 * Created by AGromov on 20.07.2016.
 */
define([
    "jquery",
    "handlebars",
    "text!view/menu.hbs"
], function($, hbs, tpl) {
    return {
        init: function() {
            this.render([{title: "some_random_metrics"}]);
        },

        render: function(list) {
            $(".left-navi").html(hbs.compile(tpl)({items: list}));
        }
    }
});
