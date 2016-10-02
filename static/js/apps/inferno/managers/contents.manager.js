/***
 * handle save
 */
define(["Kimo/core", "require", "bi.models", "manager!inferno:terza", "manager!inferno:viewmode", "bi.views", "bi.components/translationslist/main"], function(Kimo, require, Models, terzaManager, viewmodeManager) {
    var ContentManager = (function() {
        var config = {
            "editZone": "#edit-zone",
            contentTpl: "<p class='stz'>{{content}} <span><strong>Mwen menm</strong></span></p>"
        },
        currentTerza = null,
        terzaWidget = null,
        terzaEditorForm = null,
        translationList = null,
        userTranslationRepository = null,
        terzaNode = null,
        isConfigured = false,
        previousEditedContent = null,
        previousSelection = null,
        KREYOL = "kr",
        configure = function(userConfig) {

            if (isConfigured == true) {
                return;
            }
            $.extend(true, config, userConfig);
            //terzaEditor = $("#edit-zone");
            /* user contentManager */
            userTranslationRepository = Models.createTranslationRepository({prefix:'currentuser'});

            var translationsView = Kimo.createEntityView("TranslationsView", {
                entity: Models.createTranslationRepository(),
                root: config.root,
                mode: config.mode,
                contentBadge: ".content-badge"
            });

            terzaWidget = Kimo.createEntityView("terzaEditorView", {
                root: config.root,
                viewMode: config.viewMode,
                repository: userTranslationRepository
            });

            $("#contributions").html(translationsView.render());

            /*... Translation list ...*/
            translationList = Kimo.createEntityView("TranslationListView", {
                entity: Models.createTranslationRepository(),
                height: $(document).height() - 200
            });

            bindEvents();
            isConfigured = true;
        },

        showUserTranslation = function(transalation, clonedNode, noTerza, currentSelection) {
            var currentLang = Kimo.ParamsContainer.get("currentLang");
            /*if (currentLang === KREYOL) {
                return false;
            }*/
            
            currentTerza = terzaManager.getCurrentTerza();

            /* afficher */
            if (previousSelection) {
                $(previousSelection).show();
            }
            var ctn = $("<div/>"),
            terzaItem = currentSelection.parent(".terza-item").eq(0);

            $(terzaItem).after(ctn);
            terzaItem.hide();
            previousSelection = terzaItem;

            terzaWidget.configure({
                mode: "edit",
                currentTerza: currentTerza
            });

            terzaWidget.setTerzaRender($(clonedNode).html());
            terzaWidget.setTranslation(transalation);
            terzaWidget.render(ctn); //garder le render et faire update
        },

        displayUserContributions = function(html, terza) {
            if (!terza) {
                return;
            }
            translationList.setTerza(terza);
            translationList.render("#translation-ctn");
        },


        handleUserTranslation = function(clonedNode, noTerza, currentSelection) {
           
            if (!noTerza) {
                return;
            }

            var currentLang = Kimo.ParamsContainer.get("currentLang");
           /* if (currentLang === KREYOL) {
                return false;
            }*/

            /*  show form, then show user translation if exists 
                explorer : griser on click
            */
            var translationItem = new Models.TranslationItem({}); 
            translationItem.set('canto', parseInt(Kimo.ParamsContainer.get("currentCanto")));
            showUserTranslationForm(translationItem, clonedNode, noTerza, currentSelection);

            /* show user translation : show loader too */
            userTranslationRepository.getUserTranslation(noTerza).done(function (response) {
                var userTranslation = new Models.TranslationItem(response);
                if (!userTranslation.isEmpty()) {
                    terzaWidget.setTranslation(userTranslation);
                }
            })
        },


        bindEvents = function() {
            Kimo.Observable.registerEvents(['TranslationEditTask', 'TerzaSelection', 'userTabSelection']);
            Kimo.Observable.on("TerzaSelection", handleUserTranslation);

            Kimo.Observable.on("TerzaSelection", handleTerzaStats); // displayStats
            Kimo.Observable.on("TerzaSelection", displayUserContributions); // contributions
            Kimo.Observable.on("TerzaSelection", hideCommentZone); //  hide Comment Zone if visible

            Kimo.Observable.on("userTabSelection", function (tab) {
                if (tab === "contribution") {
                    translationList.refresh();
                }
            });
            
            userTranslationRepository.on("change", handleUserContribution);
        },

        handleUserContribution = function (reason, translation) {
            if (reason !== 'remove') { return false; }
            var translation = new Models.TranslationItem({});
            translation.set("canto", parseInt(Kimo.ParamsContainer.get("currentCanto")));
            terzaWidget.setTranslation(translation);
        },

        /*
         * show edition actions
        **/
        showUserTranslationForm = function(userTranslation, clonedNode, noTerza, currentSelection) {
            var currentLang = Kimo.ParamsContainer.get("currentLang");
            /*if (currentLang === KREYOL) {
                return false;
            }*/
            
            if (previousSelection) {
                $(previousSelection).show();
            }
            var ctn = $("<div/>"),
            terzaItem = currentSelection.parent(".terza-item").eq(0);

            displayTerzaForm(userTranslation, clonedNode, ctn);
            $(terzaItem).after(ctn);
            terzaItem.hide();
            previousSelection = terzaItem;
        },

        hideCommentZone = function() {

            if (viewmodeManager.getCurrentMode() === "comment") {
                viewmodeManager.switchViewMode("terza");
            }
        },

        handleTerzaStats = function(html, terzaNo) {

            if (!terzaNo) {
                return false;
            }

            $.get("/rest/stats/terza/" + terzaNo).done(function(stats) {
                if (stats && stats.hasOwnProperty('translation')) {
                    $("#contrib_stats_label").text(stats.translation);
                }
            });
        },

        displayTerzaForm = function(userTranslation, terzaNode, ctn) {
            currentTerza = terzaManager.getCurrentTerza();
            if (!currentTerza) { return false; }

            userTranslation.set("terza", currentTerza);

            terzaWidget.setTerzaRender($(terzaNode).html());
            terzaWidget.setTerza(currentTerza);

            terzaWidget.configure({
                mode: "edit",
                translation: userTranslation,
                onAction: function (action) {
                    Kimo.Observable.trigger("translationEdition", action, userTranslation);
                }
            });

            terzaWidget.render(ctn);
        },
        /* create a stranza editor */
        editContent = function(translationItem, render) {
            if (previousEditedContent) {
                $(previousEditedContent).show();
            }
            var editorView;
            $(terzaWidget).val(translationItem.get("content"));
            $(render).hide();

            terzaEditor.configure({
                mode: "edit",
                translation: translationItem,
                repository: Models.TranslationRepository,
                onAction: function(type) {
                    if (type == "cancel" || type == "save") {
                        $(render).show();
                    }
                }
            });
            editorView = terzaWidget.render();
            $(render).after(editorView);
            previousEditedContent = render;
        },
        showEditTab = function() {
            $('#user-action-tab a[href="#editing"]').tab('show') // Select tab by name
        },
        getApi = function() {
            return {
                configure: configure,
                showEditTab: showEditTab
            }
        }
        return getApi();
    })();
    return ContentManager;
});