define(["Kimo.NavigationManager"], function (NvgManager) {
    NvgManager.registerRoutes("BabelioInferno", {

        "inferno:home": {
            url: "#/inferno/home",
            action: "MainActivity:home"
        },

        "profile:show": {
            url: "#/inferno/profile/tdfmj6",
            action: "MainActivity:showProfile"
        },

        "inferno:edit": {
            url: "#/inferno/canto/2",
            action: "MainActivity:showCanto"
        }

    });

});

