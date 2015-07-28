define(["Kimo.NavigationManager"], function (NvgManager) {
    NvgManager.registerRoutes("Inferno", {

        "inferno:home": {
            url: "#/inferno/home",
            action: "MainActivity:home"
        },

        "profile:show": {
            url: "#/inferno/profile/index",
            action: "MainActivity:showProfile",
            renderer: {zone : "#profile", animation: "slideIn"}
        },

        "inferno:showcanto": {
            url: "#/inferno/canto/{no}",
            action: "MainActivity:showCanto",
            templateName: 'home'
        },

        "inferno:admin": {
            url: "#/inferno/admin",
            action: "AdminActivity:index"
        },

        "inferno:usercreate": {
            url: "#/inferno/user/create",
            action: "AdminActivity:createUser"
        }


    });

});

