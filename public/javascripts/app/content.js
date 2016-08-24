/**
 * Created by AGromov on 20.07.2016.
 */

define([
    "jquery",
    "handlebars",
    "app/storage",
    "app/compare",
    "text!view/content.hbs",
    "text!view/content-default.hbs",
    "text!view/metrics.hbs",
    "text!view/metrics-navi.hbs",
    "text!view/compare.hbs"
], function($, hbs, storage, compare, content, contentDefault, metricsTpl, naviTpl, compareTpl) {
    return {
        layout: hbs.compile(content),
        metricsTpl: hbs.compile(metricsTpl),
        naviTpl: hbs.compile(naviTpl),
        compareTpl: hbs.compile(compareTpl),
        init: function() {

        },

        setSchema: function(schema, title) {
            if(schema[0] == "#") {
                schema = schema.substr(1);
            }
            if(schema == "compare") {
                this.renderComparison();
                return;
            }
            
            this.schema = schema;
            var self = this;
            var data = storage.getState("metrics_list");
            var renderingData = null;
            if(data) {
                renderingData = data.filter((item) => {
                    return item._id == schema;
                })[0];
                if(renderingData) {
                    renderingData = renderingData.metrics;
                }
            }
            if(!renderingData) {
                if(!schema) {
                    renderingData = contentDefault;
                } else {
                    $.get("/api/metrics/" + schema + "/", function(data) {
                        renderingData = data.metrics;
                        self.render(renderingData, title);
                    });
                }
            }
            self.render(renderingData, title);
        },

        renderComparison: function() {

            if(!compare.oidsList.length) {
                // wait until we got data
                var wait = () => {
                    var state = storage.getState("metrics_list");
                    if(state) {
                        var oids = window.location.hash.split("/");
                        for(let i = 1; i < oids.length; i++) {
                            compare.changeComparison(oids[i]);
                        }
                        this.renderComparisonFinish();
                    } else {
                        setTimeout(wait, 100);
                    }
                };
                wait();

            }

            this.renderComparisonFinish();
        },

        renderComparisonFinish: function() {
            var data = compare.compareResult;
            var $content = $(this.compareTpl({
                table: data,
                baseMetric: compare.titles[0],
                metrics: compare.titles
            }));

            $(".right-content").html($content);

            $(".right-content .hide_success").change((evt) => {
                var target = evt.currentTarget;
                if($(target).prop("checked")) {
                    $content.find(".success").hide();
                    $content.find(".compare-columns").each((idx, item) => {
                        var $this = $(item);
                        if(!$this.find(".danger, .warning").size()) {
                            $this.hide();
                        }
                    });

                    $content.find(".compare-table").each((idx, item) => {
                        var $this = $(item);
                        if(!$this.find(".danger, .warning").size()) {
                            $this.hide();
                        }
                    });
                } else {
                    $content.find(".success, table, .compare-table, .compare-columns").show();
                }
            });
        },

        render: function(data, title) {
            var content = contentDefault;
            var navi = "";
            if(data) {
                data = data.map((item) => {
                    item.rows = parseInt(item.rows);
                    return item;
                });
                data = {tables: data};
                content = this.metricsTpl(data);
                navi = this.naviTpl(data);
            }
            $(".right-content").html(this.layout({
                content: content,
                schema: this.schema ? `${title} (${this.schema})` : "unknown",
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
