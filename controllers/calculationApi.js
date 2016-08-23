/**
 * Created by AGromov on 22.08.2016.
 */
'use strict';

var MetricsEntity = require("../model/MetricsEntity"),
    Calc = require("../model/MetricsCalculator");



class calculationApi {
    calculate(settingsId) {
        var metrics = null;
        return MetricsEntity.findOne({_id: settingsId}).exec().then((entity) => {
            entity.status = "Calculating";
            metrics = entity;
            setTimeout(() => {
                var calc = new Calc(metrics);
                calc.calculate().then((data) => {
                    metrics.metrics = data;
                    metrics.status = "Done";
                    return metrics.save();
                });
            });
            return entity.save();
        });
    }

    read(settingsId) {
        return MetricsEntity.findOne({_id: settingsId}).exec().then((entity) => {
            if(!entity.metrics) {
                return this.calculate(settingsId)
            } else {
                return entity;
            }
        });
    }
}

module.exports = new calculationApi();
