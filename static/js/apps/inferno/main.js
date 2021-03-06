Kimo.require.config({
    waitSeconds: 10,
    urlArgs: 'rand=' + Math.random(),
    shim: {
        'vendor.annotator': {
            deps: ['jquery'],
            exports: "Annotator"
        }
    },
    paths: {
        "bi.route": "apps/inferno/routes",
        "bi.managers": "apps/inferno/managers",
        "bi.terza.manager": "apps/inferno/managers/terza.manager",
        "bi.contents.manager": "apps/inferno/managers/contents.manager",
        "bi.pager.manager": "apps/inferno/managers/pager.manager",
        "bi.models": "apps/inferno/models",
        "bi.forms": "apps/inferno/forms",
        "bi.templates": "apps/inferno/templates/",
        "bi.views": "apps/inferno/views/views",
        "bi.components": "apps/inferno/components/",
        "bi.viewsContainer": "apps/inferno/views/",
        "Kimo.localstorage": "kimonic/core/Kimo.adapter.localstorage",
        "vendor.mustache": "kimonic/vendor/mustache/mustache",
        "vendor.moment": "apps/inferno/bower_components/moment/min/moment.min",
        "vendor.annotator": "apps/inferno/bower_components/annotator/pkg/_annotator-full"
    }
});

/* main Application here */
/*autoload activity*/
define(["Kimo/core", "bi.route", "vendor.mustache", "Kimo.localstorage"], function(Kimo) {

    return Kimo.ApplicationManager.create("Inferno", {
        _settings: {
            mainViewContainer: ".app-wrapper",
            mainActivity: "MainActivity",
            route: "inferno:showcanto",
            viewSettings: {
                id: "inferno-app",
                cls: "babelio-inferno",
                draggable: false,
                resizable: true,
                size: {
                    //width: "1024px",
                    height: "auto", //850
                    position: "fullsize", /* fullscreen, fixed */
                    responsive: true
                }
            }
        },
        onStart: function() {
            var restAdapter = Kimo.AdapterRegistry.get("restAdapter");
            restAdapter.settings.envelope = false;
            Kimo.ModelManager.useAdapter(restAdapter);
        },
        onError: function(e) {
            console.log(e);
        }

    });
}, function(e) {
	console.log("Application Error");
    console.log(arguments);
});

