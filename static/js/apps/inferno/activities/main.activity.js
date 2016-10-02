define(["Kimo/core", 'manager!inferno:pager', 'manager!inferno:terza', 'manager!inferno:comment', 'manager!inferno:contents', 'manager!inferno:annotation', 'manager!inferno:vote'],
        function(Kimo, Pager, terzaManager, CommentManager, ContentMananager, AnnotationManager, VoteManager) {

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
                indexAction: function(pagerManager,imoRequest, $kimoManager, infernoBlaze) {

                },
                /*
                 * - avant chaque appel décorer l'action
                 * - mettre décorator dans fichier
                 **/
                handleActionDecorators: function(action) {

                    Kimo.decorateWith(action, function(a, b) {


                    });
                    return action;
                },
                onCreate: function() {
                    var self = this;
                    Kimo.Observable.registerEvents(['CantoLoaded', 'TerzaSelection','translationEdition', 'CantoTranslationLoaded', 'EnterCommentMode', 'disabledCanto']);
                    this.currentMode = Kimo.ParamsContainer.get("config");

                    Kimo.ParamsContainer.set("translated", 1);
                    this.terzaManager = terzaManager;
                    this.contentsManager = ContentMananager;

                    this.pagerManager = Pager.configure({root: this.view.view, viewMode: this.currentMode.mode});
                    this.commentManager = CommentManager.configure({root: this.view.view, viewMode: this.currentMode.mode});
                    this.terzaManager.configure({root: this.view.view, canto: 1, viewMode: this.currentMode.mode});
                    this.contentsManager.configure({root: this.view.view, viewMode: this.currentMode.mode});

                    this.annotationManager = AnnotationManager.configure({root: this.view.view, viewMode: this.currentMode.mode});

                    /* canto change */
                    this.pagerManager.getPager().on("cantoSelection", function(e, canto) {
                        Kimo.ParamsContainer.set("currentCanto", canto);
                        self.terzaManager.loadCanto(canto);
                        Kimo.NavigationManager.getRouter().updateRoute("#/inferno/canto/" + canto);
                    });

                    Kimo.Observable.on('CantoLoaded', function() {
                        self.terzaManager.selectTerzaByPosition(1);
                        self.initTabs('#annotation');
                    });

                    Kimo.Observable.on('disabledCanto', function() {
                        alert("O poko ka edite chan sa a. ");
                    });

                    Kimo.Observable.on('CantoTranslationLoaded', function() {
                        self.terzaManager.selectTerza(self.terzaManager.getCurrentTerza(), false);
                    });

                    Kimo.Observable.on("EnterCommentMode", function(translation, itemHtml) {
                        self.commentManager.showCommentList(translation, itemHtml);
                    });

                    Kimo.Observable.on("TerzaSelection", function (html, terzaNo) {
                        Kimo.ParamsContainer.set("currentTerza", terzaNo);
                    });

                    Kimo.Observable.on("translationEdition", function (action, translationItem) {
                        if (action === "save" || action === "delete") {
                            self.terzaManager.loadCanto(translationItem.getCanto(), "kr", false);
                        }
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

                        /* handle translator */
                        $ ("#annotation .translator").hide();
                        $ ("#annotation " + "." + lang).show();

                    });
                },
                
                initTabs: function(selections) {
                    $(this.view.view).on("click", "#user-action-tab a", function(e) {
                        e.preventDefault();
                        $(this).tab('show');
                        Kimo.Observable.trigger("userTabSelection", $(e.target).parent().data("tab"));
                    });
                    
                    /* handle selection Here */
                    if (typeof selections !== 'string') return {}; 
                    selections = selections.split(',');
                    $.each(selections, function (i) {
                        var selector = selections[i].replace('#', ''); 
                        $("[data-tab='" + selector + "'] > a").eq(0).trigger('click');                       
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
                
                showProfileAction: function() {
                    this.data = {sdsd: 'sdsd'};
                    return {name: "Tema "};
                }


            });
        });
