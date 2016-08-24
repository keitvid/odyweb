/**
 * Created by AGromov on 23.08.2016.
 */
'use strict';
define([
    "app/storage",
    
    "app/comparators/table-comparators",
    "app/comparators/field-comparators"
], function(
    storage,
    tableComparators,
    fieldComparators
) {
    return {
        oidsList: [],
        cpmList: [],
        keysList: [],
        tableComparators: tableComparators,
        fieldComparators: fieldComparators,
        report: [],
        titles: [],
        compareResult: null,

        doCompare: function() {
            var data = storage.getState("metrics_list");
            this.cpmList = [];
            this.titles = [];
            this.oidsList.forEach((item) => {
                let metric = data.filter((dataItem) => {
                    return dataItem._id == item;
                })[0];
                this.titles.push(metric.title);
                this.cpmList.push(this.prepareList(metric.metrics));
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

            this.compareResult = this.doTableCompare();
            return this.compareResult;
        },

        doTableCompare: function() {
            var report = [];
            for(var key in this.keysList) {
                if(!this.keysList.hasOwnProperty(key)) continue;

                var tables = [];
                var reportItem = {
                    table: key,
                    validations: [],
                    columns: []
                };

                report.push(reportItem);

                this.cpmList.forEach((item, idx) => {
                    var t = item[key];
                    if(!t) {
                        reportItem.validations.push({
                            message: "Unexistant table",
                            severity: "danger",
                            result: false
                        });
                    }
                    tables.push(t);
                });
                this.tableComparators.forEach((comparator) => {
                    reportItem.validations.push({
                        message: comparator.validationMessage,
                        severity: comparator.severity,
                        result: comparator.compare(tables)
                    });
                });

                reportItem.columns = this.doColumnCompare(tables);
            }

            console.dir(report);
            return report;
        },

        doColumnCompare: function(tables) {
            var cols = {};
            tables.forEach((table, t_idx) => {
                table.columns.forEach((col) => {
                    if(!cols[col.name]) {
                        cols[col.name] = [];
                    }
                    cols[col.name][t_idx] = col;
                });
            });

            var colsReport = [];

            for(let key in cols) {

                if(!cols.hasOwnProperty(key)) {
                    continue;
                }

                var colsReportItem = {
                    name: key,
                    validations: this.fieldComparators.map((compare) => {
                        return {
                            message: compare.validationMessage,
                            severity: compare.severity,
                            result: compare.compare(cols[key])
                        }
                    })
                };

                colsReport.push(colsReportItem);
            }

            return colsReport;
        },

        changeComparison: function(oid) {
            var found = false;
            this.compareResult = null;
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

            if(this.oidsList.length > 1) {
                this.doCompare();
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
