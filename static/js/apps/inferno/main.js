Kimo.require.config({
    paths: {
        "bi.route": "apps/inferno/routes",
        "bi.managers":"apps/inferno/managers",
        "bi.terza.manager": "apps/inferno/managers/terza.manager",
        "bi.contents.manager": "apps/inferno/managers/contents.manager",
        "bi.models": "apps/inferno/models",
        "bi.templates": "apps/inferno/templates/", 
        "bi.views": "apps/inferno/views/views",
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
            Kimo.ModelManager.useAdapter(Kimo.AdapterRegistry.get("restAdapter"));
        },
        
        onError: function (e) {
            console.log("error", e);
        }

    });
}, function (e) {
    console.log("error", e);
});

