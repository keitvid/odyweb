/**
 * Created by AGromov on 22.08.2016.
 */
'use strict';

var MetricsEntity = require("../model/MetricsEntity"),
    Calc = require("../model/MetricsCalculator");



class calculationApi {
    calculate(settingsId) {
        return MetricsEntity.findOne({_id: settingsId}).exec().then((entity) => {
            var calc = new Calc(entity);
            return calc.calculate();
        });
    }
}

module.exports = new calculationApi();