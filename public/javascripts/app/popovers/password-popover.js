/**
 * Created by AGromov on 23.08.2016.
 */

define([
    "jquery",
    "handlebars",
    "util/post-json",
    "util/popover",
    "text!view/password-popover.hbs"

], ($, hbs, postJson, Popover, contentTpl) => {
    class PasswordPopover {
        constructor() {
            this.tpl = hbs.compile(contentTpl);
            this.$content = $(this.tpl());
            this.popover = new Popover(this.$content, {title: "Password request"});
            this.$input = this.$content.find("input");
        }

        show(metric) {
            this.$input.val("");

            return this.popover.show().then(() => {
                return this.$input.val();
            });
        }
    }

    return new PasswordPopover();
});