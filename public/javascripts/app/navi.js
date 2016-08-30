/**
 * Created by AGromov on 20.07.2016.
 */
define([
    "jquery",
    "handlebars",
    "app/popovers/settings-popover",
    "app/popovers/password-popover",
    "util/post-json",
    "app/storage",
    "app/compare",
    "text!view/menu.hbs"
], function($, hbs, settingsPopover, passwordPopover, postJson, storage, compare, tpl) {
    return {
        $body: $,
        itemList: {},
        init: function() {
            this.refresh();
            setInterval(() => {
                this.refresh();
            }, 5000);
        },

        refresh: function() {
            fetch(`/api/settings`).then((data) => {
                return data.json();
            }).then((data) => {
                data.forEach((item) => {
                    this.itemList[item._id] = item;
                });
                storage.setState("metrics_list", data);
                this.render(data);
            });
        },

        render: function(list) {
            var oidsToCheck = [];
            var hash = window.location.hash.split("/");


            $(".chk-compare:checked").each((idx, item) => {
                oidsToCheck.push(item.dataset.oid);
            });

            list = list.map((item) => {
                if(!item.status) {
                    item.status = "Not calculated";
                }

                return item;
            });

            this.$body = $(hbs.compile(tpl)({items: list}));
            $(".left-navi").html(this.$body);
            if(hash[0] == "#compare") {
                for(let i = 0; i < hash.length; i++) {
                    $(`.chk-compare[data-oid="${hash[i]}"]`).prop("checked", true);
                }
            } else {
                oidsToCheck.forEach((item) => {
                    $(`.chk-compare[data-oid="${item}"]`).prop("checked", true);
                });
            }


            this.staticEventHandlers();
        },

        staticEventHandlers: function() {
            this.$body.on("click", ".btnAddMetric", (evt) => {
                this.showPopover(evt);
            });

            this.$body.on("click", ".btnDeleteMetric", (evt) => {
                this.deleteMetrics(evt);
            });

            this.$body.on("click", ".btnEditMetric", (evt) => {
                this.editMetrics(evt);
            });

            this.$body.on("click", ".btnRefreshMetric", (evt) => {
                this.refreshMetrics(evt);
            });

            this.$body.on("change", ".chk-compare", (evt) => {
                this.manageComparison(evt);
            });
        },

        manageComparison: function(evt) {
            var oid = evt.target.dataset.oid;
            compare.changeComparison(oid);
            if(compare.compareResult) {
                window.location.hash = `#compare/${compare.oidsList.join("/")}`;
            }
        },

        editMetrics: function(evt) {
            var target = evt.currentTarget;
            this.showPopover(null, target.dataset.oid);
        },

        deleteMetrics: function(evt) {
            var target = evt.currentTarget;
            if(!confirm("Are you sure?")) {
                return;
            }

            fetch(`/api/settings/${target.dataset.oid}/`, {
                method: "delete"
            }).then(() => {
                this.refresh();
            });
        },

        refreshMetrics: function(evt) {
            var oid = evt.currentTarget.dataset.oid;

            passwordPopover.show().then((pwd) => {
                return postJson(`/api/calc/${oid}`, {pwd: pwd});
            }).then(() => {
                this.refresh();
            });
        },

        showPopover: function(evt, oid) {
            var data = {};
            if(evt && evt.target.dataset.oid) {
                data = this.itemList[evt.target.dataset.oid] || {};
            }
            if(oid) {
                data = this.itemList[oid] || {};
            }

            settingsPopover.show(data).then((data) => {
                this.refresh();
            }).catch((err) => {
                //alert(err);
            });
        }
    }
});
