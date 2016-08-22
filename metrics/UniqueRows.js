/**
 * Created by AGromov on 22.08.2016.
 */
'use strict';
var MetricsBase = require("./MetricsBase");

class UniqueRows extends MetricsBase {

    constructor(connection, table, field) {
        super(connection, table, field);
        this.title = "Unique Rows";
    }

    calculate() {
        this.outFieldName = "cnt";
        return super.doQuery(`SELECT count(distinct(*)) FROM ${this.table}`);
    }
}

module.exports = UniqueRows;
