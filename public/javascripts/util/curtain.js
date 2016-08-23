/**
 * Created by AGromov on 08.08.2016.
 */

define([
    "jquery",
    "handlebars",
    "text!view/util/curtain.hbs"
], function($, hbs, tpl) {
    'use strict';

    var curtain = {
        items: [],
        init: function() {
            this.$body = $(hbs.compile(tpl)());
            $("body").append(this.$body);
            this.$body.click(() => {
                this.close();
            });
        },

        register: function(item) {
            this.items.push(item);
        },

        show: function() {
            this.$body.show();
        },

        close: function() {
            this.$body.hide();
            for(let i = 0; i < this.items.length; i++) {
                this.items[i].close();
            }
        },

        hide: function() {
            if(!this.$body.is(":visible")) {
                return;
            }
            this.$body.hide();
            for(let i = 0; i < this.items.length; i++) {
                this.items[i].hide();
            }
        }
    };

    $(function() {
        curtain.init();
    });

    return curtain;
});