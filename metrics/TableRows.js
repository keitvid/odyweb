/**
 * Created by AGromov on 22.08.2016.
 */
'use strict';
var MetricsBase = require("./MetricsBase");

class TableRows extends MetricsBase {

    constructor(connection, table, field) {
        super(connection, table, field);
        this.title = "Rows";
    }

    calculate() {
        this.outFieldName = "cnt";
        return super.doQuery(`SELECT COUNT(*) as cnt FROM ${this.table}`).then((value) => {
            return parseInt(value);
        });
    }
}


module.exports = TableRows;
