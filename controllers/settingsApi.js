/**
 * Created by AGromov on 19.08.2016.
 */
'use strict';

var MetricsEntity = require("../model/MetricsEntity");

const methods = {
    "save": "save",
    "create": "create"
};

class SettingsApi {
    constructor() {
        this.methods = methods;
    }

    create(data) {
        var entity = new MetricsEntity(data);
        return new Promise((resolve, reject) => {
            entity.save((err) => {
                if(err) {
                    reject(err)
                } else {
                    resolve({success: true});
                }
            })
        });
    }

    list() {
        return new Promise((resolve, reject) => {
            MetricsEntity.find({}, (err, data) => {
                if(err) {
                    reject(err);
                } else {
                    var cleaned = data.map((item) => {
                        delete item.metrics;
                        return item;
                    });
                    resolve(cleaned);
                }
            });
        });
    }

    delete(oid) {
        return new Promise((resolve, reject) => {
            MetricsEntity.find({_id: oid}).remove((err) => {
                if(err) {
                    reject(err);
                } else {
                    resolve({success: true});
                }
            });
        });
    }

    save(oid, data) {
        return new Promise((resolve, reject) => {
            MetricsEntity.findOne({_id: oid}, (err, item) => {
                if(err) {
                    reject(err);
                    return;
                }

                for(var x in data) {
                    if(!data.hasOwnProperty(x)) continue;
                    item[x] = data[x];
                }
                item.save(function(err) {
                    if(err) {
                        reject(err);
                    } else {
                        resolve({success: true});
                    }
                })
            });
        })
    }
}

module.exports = new SettingsApi();
