/**
 * Created by AGromov on 19.08.2016.
 */
'use strict';
var settingsApi = require("./settingsApi");

class Api {
    constructor() {
        this.handlers = {};
        this.handlers.settings = settingsApi;


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
