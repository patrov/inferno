define(["Kimo/core",'require', 'bi.terza.manager', 'bi.contents.manager'], function(Kimo, require) {

    Kimo.ActivityManager.createActivity("MainActivity", {
        appname: "BabelioInferno",
        initView: function() {
            var rootView = {
                name: "main-board",
                title: "mainBoard",
                contentEl: $("<div> Radical blaze </div>").clone()
            };
            this.setContentView(rootView);
        },

        onCreate: function () {
            var self = this;
            this.terzaManager = require('bi.terza.manager');
            this.contentsManager = require('bi.contents.manager');
            
            this.terzaManager.configure({
                root: this.view.view,
                canto: 1
            });
            
            this.initTabs();
            var bootstrap = require('bootstrap');
            $(this.view.view).on("click",".btn-link", function (e) {
                var lang = $(e.currentTarget).data("lang");
                if(!lang) return;
                $(".canto-ctn").hide();
                var className = lang+"-canto-container";
                $("."+className).show();
            });

            $(this.view.view).on("mouseenter", ".current-translation", function (e) {
                var stz = e.currentTarget;
                self.terzaManager.showLanguages(stz);
            });
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
            console.log("... I'm here ");
        },
        
        templateReady: function () {
            this.contentsManager.configure({ root: this.view.view });
            this.terzaManager.loadCanto();
        },
        
        homeAction: function () {
            var self = this;
            require(['text!bi.templates/tradboard.html'], function(tpl){
                $(self.view.view).html($(tpl));
                self.templateReady();
            });
        },

        showCantoAction: function () {
            var self = this;
            require(['text!bi.templates/canto2.html'], function(tpl){
                $(self.view.view).html($(tpl));
            });
        },

        showProfileAction: function () {
            var self = this;
            require(['text!sw.templates/profiles.html'], function(tpl){
                $(self.view.view).html($(tpl));
            });
        }

    });
});
