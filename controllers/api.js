/**
 * Created by AGromov on 19.08.2016.
 */
'use strict';
var settingsApi = require("./settingsApi"),
    calculationApi = require("./calculationApi");

class Api {
    constructor() {
        this.handlers = {};
        this.handlers.settings = settingsApi;
        this.handlers.calc = calculationApi;
    }

    call(method) {
        var methodSpec = method.split("/"),
            handler = this.handlers[methodSpec[0]];

        var restArgs = [];
        for(var i = 1; i < arguments.length; i++) {
            restArgs.push(arguments[i]);
        }

        console.dir(restArgs);

        console.log(methodSpec);
        console.dir(handler);

        return handler[methodSpec[1]].apply(handler, restArgs);
    }
}

module.exports = new Api();
