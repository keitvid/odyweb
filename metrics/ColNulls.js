/**
 * Created by AGromov on 22.08.2016.
 */
'use strict';
var MetricsBase = require("./MetricsBase");

class ColNulls extends MetricsBase {

    constructor(connection, table, field) {
        super(connection, table, field);
        this.title = "Nulls";
    }

    calculate() {
        this.outFieldName = "cnt";
        return super.doQuery(`SELECT COUNT(*) as cnt FROM ${this.table} WHERE ${this.field} IS NULL`);
    }
}


module.exports = ColNulls;