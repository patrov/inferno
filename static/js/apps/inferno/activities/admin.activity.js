define(['Kimo/core'], function (Kimo) {
    Kimo.ActivityManager.createActivity("AdminActivity", {
        appname: "Inferno",
         initView: function () {
            var rootView = {
                name: "admin-zone",
                title: "adminZone",
                contentEl: $("</div>").clone()
            };
            this.setContentView(rootView);
        },

        onCreate: function () {

        },

        indexAction: function () {
            var elements = {menuItems: ["One", "Part", "Last", "Radical"]};
            return elements;
        }

    });
});