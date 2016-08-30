/**
 * Created by AGromov on 08.08.2016.
 */

define([
    "jquery",
    "handlebars",
    "util/curtain",
    "text!view/util/popover.hbs"
], function($, hbs, curtain, mainTpl) {
    var tpl = hbs.compile(mainTpl);

    var defaults = {
        title: "popover",
        buttonOk: "ok",
        buttonCancel: "cancel"
    };

    class Popover {
        constructor($containingElement, options) {
            this.$content = $containingElement;

            var opts = Object.assign(defaults, options);

            this.$body = $(tpl(opts));
            this.$body.find(".sr-popover-content").append(this.$content);
            $("body").append(this.$body);
            this.hide();
            curtain.register(this);

            this.bindEvents();
        }

        setContent($containingElement) {
            this.$content = $containingElement;
            this.$body.find(".sr-popover-content").empty().append(this.$content);
        }

        bindEvents() {
            this.$body.on("click", ".sr-popover-btn-close, .sr-button-cancel", () => {
                this.close();
            });

            this.$body.on("click", ".sr-button-ok", () => {
                this.ok();
            });
        }

        show() {
            this.$body.show();
            curtain.show();
            return new Promise((resolve, reject) => {
                this.resolve = resolve;
                this.reject = reject;
                this.visible = true;
            });
        }

        hide() {
            var hideCurtain = this.visible;
            this.visible = false;
            this.$body.hide();
            if(hideCurtain) {
                curtain.hide();
            }

        }

        close() {
            if(!this.visible) return;
            this.hide();
            this.reject("Closed");

        }

        ok() {
            this.hide();
            this.resolve();
        }
    }

    return Popover;
});


