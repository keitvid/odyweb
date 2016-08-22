/**
 * Created by AGromov on 22.08.2016.
 */
'use strict';
var MetricsBase = require("./MetricsBase");

class TableRows extends MetricsBase {

    constructor(connection, table, field) {
        this.title = "Rows";
        super(connection, table, field);
    }

    calculate() {
        return new Promise((resolve, reject) => {
            var query = this.connection.query(`SELECT COUNT(*) as cnt FROM ${this.table}`);
            query.on("error", (err) => {
                reject(err);
            });
            var output = 0;
            query.on("row", (data) => {
                output = data["cnt"];
            });
            query.on("end", () => {
                resolve(output);
            })
        });
    }
}