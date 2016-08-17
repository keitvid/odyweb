/**
 * Created by AGromov on 20.07.2016.
 */
define([
    "jquery",
    "handlebars",
    "app/navi",
    "app/content",
    "text!view/layout.hbs"
], function ($, hbs, navi, content, layout) {
    'use strict';
    var obj = {
        init: function() {
            var self = this;

            $("body").html(hbs.compile(layout)({}));
            navi.init();

            $(window).on("hashchange", function() {
                self.changeSchema();
            });
            this.changeSchema();
        },

        changeSchema: function() {
            content.setSchema(window.location.hash);
        }
    };

    $(function() {
        obj.init();
    });

    return obj;
});
