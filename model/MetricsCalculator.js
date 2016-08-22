/**
 * Created by AGromov on 19.08.2016.
 */
'use strict';
var pg = require("pg");

var TableRows = require("../metrics/TableRows"),
    UniqueRows = require("../metrics/UniqueRows"),
    HasDuplicates = require("../metrics/HasDuplicates"),
    ColNulls = require("../metrics/ColNulls"),
    ColUnique = require("../metrics/ColUnique"),
    ColNullsRate = require("../metrics/ColNullsRate"),
    ColUniqueRate = require("../metrics/ColUniqueRate"),
    ColHasNulls = require("../metrics/ColHasNulls"),
    ColHasDuplicates = require("../metrics/ColHasDuplicates");


class ColumnStructure {
    constructor(connection, field, tableName, schema, misc) {
        this.connection = connection;
        this.field = field;
        this.tableName = tableName;
        this.schema = schema;
        this.misc = misc;

        this.metrics = [
            new ColNulls(this.connection, `${this.schema}.${this.tableName}`, this.field),
            new ColUnique(this.connection, `${this.schema}.${this.tableName}`, this.field),
            new ColNullsRate(this.connection, `${this.schema}.${this.tableName}`, this.field),
            new ColUniqueRate(this.connection, `${this.schema}.${this.tableName}`, this.field),
            new ColHasNulls(this.connection, `${this.schema}.${this.tableName}`, this.field),
            new ColHasDuplicates(this.connection, `${this.schema}.${this.tableName}`, this.field)
        ];
    }

    calculate() {
        return new Promise((resolve, reject) => {
            this.startTime = new Date();
            console.log(this.field + "!!!");
            var next = (idx) => {
                if(!this.metrics[idx]) {
                    resolve();
                } else {
                    console.log(this.metrics[idx].title);
                    this.metrics[idx].calculate(this.metrics, this.misc).then(() => {
                        console.log(idx);
                        next(++idx);
                    }).catch((err) => {
                        console.error(err.stack);
                        console.error(err);
                        console.error(this.metrics[idx].lastSql);
                        reject(err);
                    });
                }
            };

            next(0);
        });
    }

    serialize() {
        return {
            name: this.field,
            sample: [],
            metrics: this.metrics.map((item) => {
                return {
                    title: item.title,
                    value: item.value
                }
            })
        }
    }
}

class TableStructure {
    constructor(connection, tableName, schema) {
        this.connection = connection;
        this.tableName = tableName;
        this.schema = schema;

        this.columns = [];

        this.metrics = [
            new TableRows(this.connection, `${schema}.${this.tableName}` , ""),
            new UniqueRows(this.connection, `${schema}.${this.tableName}`, ""),
            new HasDuplicates(this.connection, `${schema}.${this.tableName}`, "")
        ];
    }

    readStructure() {
        return new Promise((resolve, reject) => {
            var q = this.connection.query(`
            SELECT column_name
            FROM information_schema.columns
            WHERE table_schema = '${this.schema}'
            AND table_name   = '${this.tableName}'
            `);
            this.columns = [];
            q.on("row", (row) => {
                this.columns.push(new ColumnStructure(
                    this.connection,
                    row["column_name"],
                    this.tableName,
                    this.schema,
                    this.metrics
                ));
            });
            q.on("end", () => {
                resolve();
            });
            q.on("error", (err) => {
                reject(err);
            })
        });
    }

    calculate() {
        return new Promise((resolve, reject) => {
            this.startTime = new Date();
            console.log(this.tableName + "!!!");
            var next = (idx) => {
                if(!this.metrics[idx]) {
                    resolve();
                } else {
                    console.log(this.metrics[idx].title);
                    this.metrics[idx].calculate(this.metrics).then(() => {
                        console.log(idx);
                        next(++idx);
                    }).catch((err) => {
                        console.error(err.stack);
                        console.error(err);
                        console.error(this.metrics[idx].lastSql);
                        reject(err);
                    });
                }
            };

            next(0);
        }).then((x) => {
            return this.readStructure();
        }).then(() => {
            return Promise.all(
                this.columns.map((col) => {
                    return col.calculate();
                })
            );
        });
    }

    serialize() {
        if(this.metrics[0].value) {
            return {
                "table": this.tableName,
                "generate_time": this.startTime.toISOString(),
                "rows":	this.metrics[0].value,
                "unique_rows": this.metrics[1].value,
                "has_duplicates": this.metrics[2].value,
                "columns": this.columns.map((item) => {
                    return item.serialize()
                })
            }
        } else {
            console.log("333");
            return {
                "table": this.tableName,
                "generate_time": this.startTime().toISOString()
            }
        }
    }
}

class MetricsCalculator {
    constructor(settings) {
        this.tables = [];
        this.settings = settings;
    }

    calculate() {
        return new Promise((resolve, reject) => {
            this.connection = new pg.Client(`pg://${this.settings.user}:${this.settings.password}@${this.settings.cluster}:5439/${this.settings.database}`);
            this.connection.connect((err) => {
                if(err) {
                    reject(err);
                    return;
                } else {
                    var query = this.connection.query(
                        `SELECT table_name FROM information_schema.tables WHERE table_schema = '${this.settings.schemaName}'`,
                        (err, data) => {
                            if(err) {
                                reject(err);
                                return;
                            }
                            data = data["rows"];
                            console.dir(data);

                            for(let i = 0; i < data.length; i++) {
                                console.log(data[i]["table_name"]);
                                this.tables.push(new TableStructure(
                                    this.connection,
                                    data[i]["table_name"],
                                    this.settings.schemaName
                                ));
                            }

                            var tablePromises = [];
                            this.tables.forEach((item) => {
                                tablePromises.push(item.calculate());
                            });
                            return Promise.all(tablePromises).then((x) => {
                                console.log("DONE!!!");
                                resolve(this.serialize());
                            });
                        }
                    );
                }
            });
        });
    }

    serialize() {
        console.log(this.tables.length);
        return this.tables.map((item) => {
            console.log(item.tableName);
            return item.serialize();
        });
    }
}

module.exports = MetricsCalculator;
