Kimo.require.config({
    urlArgs: "bust=" + (new Date()).getTime(),
    waitSeconds: 10,
    paths: {
        "bi.route": "apps/inferno/routes",
        "bi.managers":"apps/inferno/managers",
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
        "vendor.mustache": "kimonic/vendor/mustache/mustache"
    }
});

/* main Application here */
/*autoload activity*/
define(["Kimo/core", "bi.route", "vendor.mustache", "Kimo.localstorage"], function (Kimo) {

    return Kimo.ApplicationManager.create("Inferno", {
        _settings: {
            mainViewContainer: ".jumbotron",
            mainActivity: "MainActivity",
            route: "inferno:home",
            viewSettings: {
                id: "inferno-app",
                cls: "babelio-inferno",
                draggable: false,
                resizable: true,
                size: {
                    //width: "1024px",
                    height: "auto",//850
                    position: "fullsize",/* fullscreen, fixed */
                    responsive: true
                }
            }
        },

        onStart: function () {
            Kimo.jquery.get("/rest/config").done(function (response) {
              Kimo.ParamsContainer.set("config", response); 
            });
            var restAdapter = Kimo.AdapterRegistry.get("restAdapter");
                restAdapter.settings.envelope = false;
            Kimo.ModelManager.useAdapter(restAdapter);
        },

        onError: function (e) {
            console.log("error", e);
        }

    });
}, function (e) {
    console.log("error", e);
});

