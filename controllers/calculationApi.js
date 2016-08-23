/**
 * Created by AGromov on 22.08.2016.
 */
'use strict';

var MetricsEntity = require("../model/MetricsEntity"),
    Calc = require("../model/MetricsCalculator");



class calculationApi {
    calculate(settingsId, pwd) {
        var metrics = null;
        return MetricsEntity.findOne({_id: settingsId}).exec().then((entity) => {
            entity.status = "Calculating";
            entity.password = pwd;
            metrics = entity;
            return entity.save().then((entity) => {
                setTimeout(() => {
                    var calc = new Calc(metrics);
                    calc.calculate().then((data) => {
                        metrics.metrics = data;
                        metrics.status = "Done";
                        return metrics.save();
                    }).catch((err) => {
                        metrics.metrics = null;
                        metrics.status = `Error: ${err.message}`;
                        metrics.save();
                        return false;
                    });
                });

                return entity;
            });
        });
    }

    read(settingsId) {
        return MetricsEntity.findOne({_id: settingsId}).exec().then((entity) => {
            return entity;
        });
    }
}

module.exports = new calculationApi();
