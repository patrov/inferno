define(["Kimo/core",'require', 'bi.pager.manager', 'bi.terza.manager', 'bi.contents.manager'], function(Kimo, require) {

    Kimo.ActivityManager.createActivity("MainActivity", {
        appname: "Inferno",
        initView: function() {
            var rootView = {
                name: "main-board",
                title: "mainBoard",
                contentEl: $("</div>").clone()
            };
            this.setContentView(rootView);
        },

        events: {
            '.test click': 'sayHello'
        },

        actionDependencies: {

        },

        onCreate: function () {
            var self = this;
            this.terzaManager = require('bi.terza.manager');
            this.contentsManager = require('bi.contents.manager');
            this.pagerManager =  require('bi.pager.manager');
            this.terzaManager.configure({
                root: this.view.view,
                canto: 1
            });
            this.initTabs();
            Kimo.Observable.registerEvents(['CantoLoaded', 'CantoTranslationLoaded']);

             Kimo.Observable.on('CantoLoaded', function () {
                 self.terzaManager.selectTerzaByPosition(1);
                 self.pagerManager.selectCanto(self.terzaManager.getCurrentCanto());
             });

             Kimo.Observable.on('CantoTranslationLoaded', function () {
                 self.terzaManager.selectTerza(self.terzaManager.getCurrentTerza(),false);
             });

            /*  move to cantoManager */
            $(this.view.view).on("click", ".btn-link", function (e) {
                var lang = $(e.currentTarget).data("lang");
                self.terzaManager.loadCantoTranslation(lang);
                $(".btn-link").removeClass("selected");
                $(e.currentTarget).addClass("selected");

                $(".canto-ctn").hide();
                var className = lang+"-canto-container";
                $("."+className).show();
            });

           /* $(this.view.view).on("mouseenter", ".current-translation", function (e) {
                var stz = e.currentTarget;
                self.terzaManager.showLanguages(stz);
            });*/
        },

        initTabs: function(){
            $(this.view.view).on("click", "#user-action-tab a", function (e) {
                e.preventDefault();
                $(this).tab('show');
            });
        },

        onStart : function () {

        },

        onResume: function () {
        },

        templateReady: function (canto) {
            this.contentsManager.configure({
                root: this.view.view
            });
            this.terzaManager.loadCanto(canto);

        },

        homeAction: function () {
            var self = this;
            self.templateReady();
        },

        /* deal with template and manager here
         * template ayan
         *
         * */
        showCantoAction: function (no) {
            var self = this;
                self.templateReady(no);
        },

        sayHello: function () {
            alert("sdsd");
        },

        menuComponent: function () {
            return "<ul><li>Home</li><li>User</li><li>Contribution</li></ul>"
        },

        showProfileAction: function () {
            this.data = {sdsd:'sdsd'};
            return {name: "Tema "};
        }


    });
});
