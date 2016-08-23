/**
 * Created by AGromov on 22.08.2016.
 */
'use strict';
var MetricsBase = require("./MetricsBase"),
    TableRows = require("./TableRows"),
    ColUnique = require("./ColUnique");

class ColUniqueRate extends MetricsBase {

    constructor(connection, table, field) {
        super(connection, table, field);
        this.title = "Unique Rate";
    }

    calculate(all, misc) {
        return new Promise((resolve, reject) => {
            if(!all) {
                reject("Prevs not supplied");
                return;
            }

            var total = misc.filter((item) => {
                    return item.constructor == TableRows
                }),
                unique = all.filter((item) => {
                    return item.constructor == ColUnique
                });

            if(!total.length || !unique.length) {
                reject("Prerequisities not fulfilled");
                return;
            }
            total = total[0].value;
            unique = unique[0].value;

            this.value = total > 0 ? (parseInt(unique/total * 100) + "%") : 0;
            resolve(this.value);
        });
    }
}


module.exports = ColUniqueRate;