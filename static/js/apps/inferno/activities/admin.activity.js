define(['Kimo/core', 'bi.forms/user.form'], function (Kimo, UserForm) {
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
            UserForm.on("submit", $.proxy(this.handleUserFormSubmit, this));
        },

        indexAction: function () {
            var elements = {
                menuItems: ["One", "Part", "Last", "Radical"]
            };
            return elements;
        },

        handleUserFormSubmit: function (e) {
           $.ajax({url: '/rest/user', data : e.data.rawData, type: "POST"}).done(function (response) {
               console.log(response);
           });
        },

        createUserAction: function () {
            setTimeout(function () {
                UserForm.render("#form-ctn");
            }, 500);
        },

        postAction: function () {},

        loginUser: function () {

        },

        logoutAction: function () {}
    });
});