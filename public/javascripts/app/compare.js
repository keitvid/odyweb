/**
 * Created by AGromov on 23.08.2016.
 */

define([
    "app/storage",
    "app/comparators/is_null_table",
    "app/comparators/field_list",
    "app/comparators/is_null_field"
], function(
    storage,
    is_null_table,
    field_list,
    is_null_field
) {
    return {
        oidsList: [],
        cpmList: [],
        keysList: [],
        tableComparators: [is_null_table, field_list],
        fieldComparators: [is_null_field],
        report: [],
        titles: [],

        doCompare: function() {
            var data = storage.getState("metrics_list");
            this.cpmList = [];
            this.titles = [];
            this.oidsList.forEach((item) => {
                var data = data.filter((dataItem) => {
                    return dataItem._id == item;
                })[0];
                this.titles.push(data.title);
                this.cpmList.push(this.prepareList(data.metrics));
            });

            // Prepare keys

            this.keysList = {};

            for(var i = 0; i < this.cpmList.length; i++) {
                for(var key in this.cpmList[i]) {
                    if(!this.cpmList[i].hasOwnProperty(key)) {
                        continue;
                    }

                    this.keysList[key] = 1;
                }
            }
        },

        doTableCompare: function() {
            for(var key in this.keysList) {
                if(!this.keysList.hasOwnProperty(key)) continue;

                var tables = [];
                var reportItem = {
                    table: key,
                    validations: []
                };

                this.cpmList.forEach((item, idx) => {
                    var t = item[key];
                    if(!t) {
                        reportItem.validations.push({
                            message: "Unexistant table",
                            result: false
                        });
                    }
                    tables.push(t);
                });
            }
        },

        changeComparison: function(oid) {
            var found = false;
            for(var i = 0; i < this.oidsList.length; i++) {
                if(this.oidsList[i] == oid) {
                    this.oidsList.splice(i, 1);
                    found = true;
                    break;
                }
            }
            if(!found) {
                this.oidsList.push(oid);
            }
        },

        prepareList: function(list) {
            var outList = {};
            for(var i = 0; i < list.length; i++) {
                outList[list[i].table] = list[i];
            }

            return outList;
        }
    }
});
