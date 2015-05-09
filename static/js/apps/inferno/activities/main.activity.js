requirejs.onError = function (err) {
    console.log(err.requireType);
    console.log(err);
    console.log('modules: ' + err.requireModules);
    throw err;
};

window.onerror = function (response) {
  console.log(response);
};

define(["Kimo/core", 'require', 'manager!inferno:pager', 'manager!inferno:terza', 'manager!inferno:comment', 'manager!inferno:contents'],
function(Kimo, require, Pager, terzaManager, CommentManager, ContentMananager) {

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
           // '.test click': 'sayHello'
        },

        actionDependencies: {

        },

        onCreate: function () {
            var self = this;
            this.terzaManager = terzaManager;
            this.contentsManager = ContentMananager;
            this.pagerManager =  Pager;
            this.commentManager = CommentManager;
            this.terzaManager.configure({
                root: this.view.view,
                canto: 1
            });
            this.initTabs();
            Kimo.Observable.registerEvents(['CantoLoaded', 'CantoTranslationLoaded', 'EnterCommentMode']);

             Kimo.Observable.on('CantoLoaded', function () {
                 self.terzaManager.selectTerzaByPosition(1);
                 self.pagerManager.selectCanto(self.terzaManager.getCurrentCanto());
                 self.pagerManager.showCantoPager();
             });

             Kimo.Observable.on('CantoTranslationLoaded', function () {
                 self.terzaManager.selectTerza(self.terzaManager.getCurrentTerza(),false);
             });

             Kimo.Observable.on("EnterCommentMode", function(translation) {
                 self.commentManager.showCommentList(translation);
             });



            /*  move to cantoManager */
            $(this.view.view).on("click", ".canto-lang", function (e) {
                var lang = $(e.currentTarget).data("lang");
                if (!lang) {
                    return;
                }
                self.terzaManager.loadCantoTranslation(lang);
                $(".btn-link").removeClass("selected");
                $(e.currentTarget).addClass("selected");

                $(".canto-ctn").hide();
                var className = lang+"-canto-container";
                $("."+className).show();
            });

            /*$(this.view.view).on("mouseenter", ".current-translation", function (e) {
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
