/**
 * Created by AGromov on 22.08.2016.
 */
'use strict';

class MetricsBase {
    constructor(connection, table, field) {
        if (this.constructor === MetricsBase) {
            throw new TypeError("Cannot construct Abstract instances directly");
        }

        if (this.calculate === undefined) {
            throw new TypeError("Must implement \"calculate\" method");
        }

        this.title = "";
        this.table = table;
        this.field = field;
        this.connection = connection;
        this.value = undefined;
    }

    doQuery(sqlQuery) {
        return new Promise((resolve, reject) => {
            this.lastSql = sqlQuery;
            var query = this.connection.query(sqlQuery);
            query.on("error", (err) => {
                console.error(err);
                reject(err);
            });
            var output = 0;
            query.on("row", (data) => {
                if(this.outFieldName) {
                    data = data[this.outFieldName];
                }
                this.value = data;
                resolve(this.value);
            });
            query.on("end", () => {
                resolve(output);
            });
        });
    }
}

module.exports = MetricsBase;
