/**
 * Created by AGromov on 22.08.2016.
 */
'use strict';
var MetricsBase = require("./MetricsBase"),
    TableRows = require("./TableRows"),
    UniqueRows = require("./UniqueRows");

class HasDuplicates extends MetricsBase {

    constructor(connection, table, field) {
        super(connection, table, field);
        this.title = "Has Duplicates";
    }

    calculate(all) {
        return new Promise((resolve, reject) => {
            if(!all) {
                reject("Prevs not supplied");
                return;
            }

            var total = all.filter((item) => {
                    return item.constructor == TableRows
                }),
                unique = all.filter((item) => {
                    return item.constructor == UniqueRows
                });

            if(!total.length || !unique.length) {
                reject("Prerequisities not fulfilled");
                return;
            }
            total = total[0].value;
            unique = unique[0].value;

            this.value = total != unique;
            resolve(this.value);
        });
    }
}

module.exports = HasDuplicates;
