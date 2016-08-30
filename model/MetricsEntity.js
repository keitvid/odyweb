/**
 * Created by AGromov on 19.08.2016.
 */
var mongoose = require("mongoose"),
    Schema = mongoose.Schema;


var metricsEntitySchema = new Schema({
    title: String,
    cluster: String,
    user: String,
    password: String,
    database: String,
    schemaName: String,
    metrics: [Schema.Types.Mixed],
    status: String
});

var metricsEntity = mongoose.model("MetricsEntity", metricsEntitySchema);

module.exports = metricsEntity;
