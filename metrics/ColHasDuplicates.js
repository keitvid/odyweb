/**
 * Created by AGromov on 22.08.2016.
 */
'use strict';
var MetricsBase = require("./MetricsBase"),
    TableRows = require("./TableRows"),
    ColUnique = require("./ColUnique");

class ColHasDuplicates extends MetricsBase {

    constructor(connection, table, field) {
        super(connection, table, field);
        this.title = "Has Duplicates";
    }

    calculate(all, misc) {
        return new Promise((resolve, reject) => {
            if (!all) {
                reject("Prevs not supplied");
                return;
            }

            var total = misc.filter((item) => {
                    return item.constructor == TableRows
                }),
                unique = all.filter((item) => {
                    return item.constructor == ColUnique
                });

            if (!total.length || !unique.length) {
                reject("Prerequisities not fulfilled");
                return;
            }
            total = total[0].value;
            unique = unique[0].value;

            this.value = unique != total;
            resolve(this.value);
        });
    }
}


module.exports = ColHasDuplicates;
