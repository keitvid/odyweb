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
    }
}

module.exports = MetricsBase;