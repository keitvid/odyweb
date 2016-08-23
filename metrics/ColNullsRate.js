/**
 * Created by AGromov on 22.08.2016.
 */
'use strict';
var MetricsBase = require("./MetricsBase"),
    TableRows = require("./TableRows"),
    ColNulls = require("./ColNulls");

class ColNullsRate extends MetricsBase {

    constructor(connection, table, field) {
        super(connection, table, field);
        this.title = "Nulls Rate";
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
                nulls = all.filter((item) => {
                    return item.constructor == ColNulls
                });

            if(!total.length || !nulls.length) {
                reject("Prerequisities not fulfilled");
                return;
            }
            total = parseInt(total[0].value);
            nulls = parseInt(nulls[0].value);

            this.value = total > 0 ? parseInt(nulls/total * 100) + "%" : 0;
            resolve(this.value);
        })
    }
}


module.exports = ColNullsRate;