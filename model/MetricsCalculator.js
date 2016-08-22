/**
 * Created by AGromov on 19.08.2016.
 */
'use strict';
var pg = require("pg");

class ColumnStructure {

}

class TableStructure {
    constructor(connection, tableName, schema) {
        this.connection = connection;
        this.tableName = tableName;

        this.columns = [];

        this.metrcis = [
            {
                title: "Rows",
                
            }
        ];
    }

    calculate() {

    }

    serialize() {

    }
}

class MetricsCalculator {
    constructor(settings) {
        this.tables = [];
        this.settings = settings;
    }

    calculate() {
        return new Promise((accept, reject) => {
            this.connection = new pg.Client(`pg://${this.settings.login}:${this.password}@${this.settings.cluster}:5439/${this.database}`);
            this.connection.connect((err) => {
                if(!err) {
                    reject(err);
                    return;
                } else {
                    var query = this.connection.query(
                        `SELECT table_name FROM information_schema.tables WHERE table_schema = '${this.settings.schemaName}'`
                    );
                    query.on("row", (row) => {
                        var tbl = new TableStructure(this.connection, row["table_name"]);
                        this.tables.push(tbl);
                    });
                    query.on("end", () => {
                        this.tables.forEach((item) => {
                            item.calculate();
                        })
                    });
                }
            })
        });
    }



    serialize() {

    }
}