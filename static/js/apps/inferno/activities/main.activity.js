define(["Kimo/core",'require', 'bi.terza.manager', 'bi.contents.manager'], function(Kimo, require) {

    Kimo.ActivityManager.createActivity("MainActivity", {
        appname: "Inferno",
        initView: function() {
            var rootView = {
                name: "main-board",
                title: "mainBoard",
                contentEl: $("<div> Radical blaze </div>").clone()
            };
            this.setContentView(rootView);
        },
        
        actionDependencies: {
            
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
            $(this.view.view).on("click",".btn-link", function (e) {
                var lang = $(e.currentTarget).data("lang");
                self.terzaManager.loadCantoTranslation(lang);
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
        },
        
        templateReady: function (canto) {
            this.contentsManager.configure({
                root: this.view.view
            });
            this.terzaManager.loadCanto(canto);
        },
        
        homeAction: function () {
            var self = this;
            /* show placeholder  */
            alert("this is it");
            require(['text!bi.templates/tradboard.html'], function(tpl){
                console.log(self.view.view);
                $(self.view.view).html($(tpl));
                self.templateReady();
            });
        },
        /* deal with template and manager here 
         * template ayan
         * 
         * */
        showCantoAction: function (no) {
            var self = this;
            /*this.loadView("view!showCanto").ready(function(){});*/
            require(['text!bi.template/tradboard.html'], function(tpl){
                alert("let me tell you this ... ");
                $(self.view.view).html($(tpl));
                this.templateReady(no);
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
