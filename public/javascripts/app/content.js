/**
 * Created by AGromov on 20.07.2016.
 */

define([
    "jquery",
    "handlebars",
    "text!view/content.hbs",
    "text!view/content-default.hbs",
    "text!view/metrics.hbs",
    "text!view/metrics-navi.hbs"
], function($, hbs, content, contentDefault, metricsTpl, naviTpl) {
    return {
        layout: hbs.compile(content),
        metricsTpl: hbs.compile(metricsTpl),
        naviTpl: hbs.compile(naviTpl),
        init: function() {

        },

        setSchema: function(schema) {
            if(schema[0] == "#") {
                schema = schema.substr(1);
            }
            this.schema = schema;
            var self = this;
            if(!schema) {
                this.render(contentDefault);
            } else {
                $.get("/api/metrics/" + schema + "/", function(data) {
                    self.render(data);
                });
            }
        },

        render: function(data) {
            var content = contentDefault;
            var navi = "";
            if(data) {
                data = {tables: data};
                content = this.metricsTpl(data);
                navi = this.naviTpl(data);
            }
            $(".right-content").html(this.layout({
                content: content,
                schema: this.schema ? this.schema : "unknown",
                navi: navi
            }));
            this.bindEvents();
            $(".table-navi:first").click();
        },

        bindEvents: function() {
            var self = this;
            var $content = $('.content-metrics');
            $(".table-navi").click(function(evt) {
                evt.preventDefault();
                evt.stopPropagation();
                var target = evt.target;
                var table = target.dataset.table;
                $(".table-metrics").removeClass("active");
                $(".table-metrics[data-table=\"" + table + "\"]").addClass("active");
                $(".columns-toolbox").removeClass("active");
                $(".columns-toolbox[data-table=\"" + table + "\"]").addClass("active");
                $content.animate({
                    scrollTop: 0
                }, 1000);
            }.bind(this));

            $(".table-column-navi").click(function(evt) {
                evt.preventDefault();
                evt.stopPropagation();
                var column = evt.target.dataset.column;

                $content.animate({
                    scrollTop: $content.prop("scrollTop") +
                    $(".column-stats[data-column=\"" + column + "\"]").position().top
                }, 1000);
            });
        }
    }
});