/**
 * Created by AGromov on 20.07.2016.
 */
/**
 * Created by AGromov on 19.07.2016.
 */
require.config({
    baseUrl: "/javascripts",
    paths: {
        text: "vendor/requirejs-text/text",
        jquery: "vendor/jquery/dist/jquery",
        handlebars: "vendor/handlebars/handlebars.amd"
    }
});

require(["app/index"]);