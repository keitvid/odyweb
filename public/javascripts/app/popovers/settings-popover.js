/**
 * Created by AGromov on 19.08.2016.
 */

define([
    "jquery",
    "handlebars",
    "util/post-json",
    "util/popover",
    "text!view/settings-popover.hbs"

], ($, hbs, postJson, Popover, contentTpl) => {
    class SettingsPopover {
        constructor() {
            this.tpl = hbs.compile(contentTpl);
            this.popover = new Popover(null, {title: "Metric settings"});
        }

        show(metric) {
            if(!metric) {
                metric = {};
            }

            var $content = $(this.tpl(metric));
            this.popover.setContent($content);

            return this.popover.show().then(() => {
                var data = {};
                $content.find("input").each((idx, item) => {
                    data[item.name] = item.value;
                });
                if(!data.oid) {
                    return postJson(`/api/settings`, data);
                } else {
                    var oid = data.oid;
                    delete data["oid"];
                    return postJson(`/api/settings/${oid}/`, data, "put");
                }
            });
        }
    }

    return new SettingsPopover();
});