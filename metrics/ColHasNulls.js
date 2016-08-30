/**
 * Created by AGromov on 22.08.2016.
 */
'use strict';
var MetricsBase = require("./MetricsBase"),
    ColNulls = require("./ColNulls");

class ColHasNulls extends MetricsBase {

    constructor(connection, table, field) {
        super(connection, table, field);
        this.title = "Has Nulls";
    }

    calculate(all, misc) {
        return new Promise((resolve, reject) => {
            if (!all) {
                reject("Prevs not supplied");
                return;
            }

            var nulls = all.filter((item) => {
                return item.constructor == ColNulls
            });

            if (!nulls.length) {
                reject("Prerequisities not fulfilled");
                return;
            }
            nulls = nulls[0].value;

            this.value = nulls > 0;
            resolve(this.value);
        });
    }
}


module.exports = ColHasNulls;
