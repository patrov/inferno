 requirejs.onError = function(err) {
    console.log(err.requireType);
    console.log(err);
    console.log('modules: ' + err.requireModules);
    throw err;
};

window.onerror = function(response) {
    console.log(response);
};

define(["Kimo/core", 'manager!inferno:pager', 'manager!inferno:terza', 'manager!inferno:comment', 'manager!inferno:contents', 'manager!inferno:vote'],
        function(Kimo, Pager, terzaManager, CommentManager, ContentMananager, VoteManager) {

            Kimo.ActivityManager.createActivity("MainActivity", {
                appname: "Inferno",
                useLayout: false,

                initView: function() {
                    var rootView = {
                        name: "main-board",
                        title: "mainBoard",
                        contentEl: $("</div>").clone()
                    };
                    this.setContentView(rootView);
                },

                actionDependencies: {
                    /* use injector instead :)*/
                },

                /* @ */
                indexAction: function(pagerManager, kimoRequest, kimoManager, infernoBlaze) {

                },


                onCreate: function () {
                    var self = this;
                    Kimo.Observable.registerEvents(['CantoLoaded', 'CantoTranslationLoaded', 'EnterCommentMode', 'disabledCanto']);
                    this.currentMode = Kimo.ParamsContainer.get("config");
                    Kimo.ParamsContainer.set("translated", 1);
                    this.terzaManager = terzaManager;
                    this.contentsManager = ContentMananager;

                    this.pagerManager = Pager.configure({ root: this.view.view, viewMode: this.currentMode});
                    this.commentManager = CommentManager.configure({ root: this.view.view, viewMode: this.currentMode.mode });
                    this.terzaManager.configure({ root: this.view.view, canto: 1, viewMode: this.currentMode.mode });
                    this.contentsManager.configure({ root: this.view.view, viewMode: this.currentMode.mode });
                    this.initTabs();

                    /* canto change */
                    this.pagerManager.getPager().on("cantoSelection", function(e, canto) {
                        Kimo.ParamsContainer.set("currentCanto", canto);
                        self.terzaManager.loadCanto(canto);
                        Kimo.NavigationManager.getRouter().updateRoute("#/inferno/canto/"+canto);
                    });

                    Kimo.Observable.on('CantoLoaded', function() {
                        self.terzaManager.selectTerzaByPosition(1);
                    });

                    Kimo.Observable.on('disabledCanto', function() {
                       alert("O poko ka editer chan sa a. ");
                    });

                    Kimo.Observable.on('CantoTranslationLoaded', function() {
                        self.terzaManager.selectTerza(self.terzaManager.getCurrentTerza(), false);
                    });

                    Kimo.Observable.on("EnterCommentMode", function(translation) {
                        self.commentManager.showCommentList(translation);
                    });

                    /*  move to cantoManager */
                    $(this.view.view).on("click", ".canto-lang", function(e) {
                        var lang = $(e.currentTarget).data("lang");
                        if (!lang) {
                            return;
                        }
                        self.terzaManager.loadCantoTranslation(lang);
                        $(".available-lang > li").removeClass("active");
                        $(e.currentTarget).parent("li").addClass("active");

                        $(".canto-ctn").hide();
                        var className = lang + "-canto-container";
                        $("." + className).show();
                    });

                    /*$(this.view.view).on("mouseenter", ".current-translation", function (e) {
                     var stz = e.currentTarget;
                     self.terzaManager.showLanguages(stz);
                     });*/
                },
                initTabs: function() {
                    $(this.view.view).on("click", "#user-action-tab a", function(e) {
                        e.preventDefault();
                        $(this).tab('show');
                    });
                },

                templateReady: function(canto) {
                    this.terzaManager.loadCanto(canto);
                },

                homeAction: function() {
                    var self = this;
                    self.templateReady(1);
                },
                /* deal with template and manager here
                 * template ayan
                 * */
                showCantoAction: function(no) {
                    var self = this;

                    this.on("viewReady", function(render) {

                        self.pagerManager.showCantoPager(render.find(".col-sm-1").eq(0));
                        self.pagerManager.selectCanto(parseInt(no, 10));
                        Kimo.ParamsContainer.set("currentCanto", no);

                    });
                    self.templateReady(no);
                },

                menuComponent: function() {
                    return "<ul><li>Home</li><li>User</li><li>Contribution</li></ul>"
                },

                showProfileAction: function() {
                    this.data = {sdsd: 'sdsd'};
                    return {name: "Tema "};
                }


            });
        });
