define(["Kimo.NavigationManager"], function (NvgManager) {
    NvgManager.registerRoutes("Inferno", {

        "inferno:home": {
            url: "#/inferno/home",
            action: "MainActivity:home"
        },

        "profile:show": {
            url: "#/inferno/profile/tdfmj6",
            action: "MainActivity:showProfile"
        },

        "inferno:showcanto": {
            url: "#/inferno/canto/{no}",
            action: "MainActivity:showCanto" 
        }

    });

});

