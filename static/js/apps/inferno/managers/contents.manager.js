/***
 * handle save
 */
define(["Kimo/core", "require", "bi.models", "manager!inferno:terza", "manager!inferno:viewmode", "bi.views", "bi.components/translationslist/main"], function (Kimo, require, Models, terzaManager, viewmodeManager) {
    var ContentManager = (function () {
        var config = {
            "editZone": "#edit-zone",
            contentTpl: "<p class='stz'>{{content}} <span><strong>Mwen menm</strong></span></p>"
        },
            currentTerza = null,
            terzaEditor = null,
            translationList = null,
            terzaNode = null,
            isConfigured = false,
            previousEditedContent = null,

            configure = function (userConfig) {
                if (isConfigured == true) {
                    return;
                }
                $.extend(true, config, userConfig);
                //terzaEditor = $("#edit-zone");
                /* user contentManager */
                var translationsView = Kimo.createEntityView("TranslationsView", {
                    entity: Models.TranslationRepository,
                    root: config.root,
                    mode: config.mode,
                    contentBadge: ".content-badge"
                });

                terzaEditor = Kimo.createEntityView("terzaEditorView", {
                    root: config.root,
                    viewMode: config.viewMode
                });

                $("#contributions").html(translationsView.render());

                /*... Translation list ...*/
                translationList = Kimo.createEntityView("TranslationListView", {
                    entity: Models.TranslationRepository,
                    height: $(document).height() - 200
                });

                bindEvents();
                isConfigured = true;
            },

            setCurrentTerza = function (html, no) {
                currentTerza = no;
                terzaNode = html;
                terzaEditor.setTerzaRender($(terzaNode).html());
                terzaEditor.setTerza(currentTerza);
                displayTerzaEditor();
                displayUserContributions(currentTerza);
            },

            displayUserContributions = function (terza) {
                translationList.setTerza(terza);
                translationList.render("#trad-container");
            },

            loadTranslation = function (noTerza) {
                return $.ajax({
                    url: "/rest/translation?terza=" + noTerza
                });
            },

            handleTranslation = function (html, noTerza) {
                try {
                    loadTranslation(noTerza).done(function (response) {
                        var translation = new Models.TranslationItem(response);
                        terzaEditor.setTranslation(translation);
                    });
                } catch (e) {
                    console.log(e);
                }

            },

            bindEvents = function () {
                Kimo.Observable.registerEvents(['TranslationEditTask', 'TerzaSelection']);
                Kimo.Observable.on("TranslationEditTask", editContent);
                Kimo.Observable.on("TerzaSelection", setCurrentTerza);
                Kimo.Observable.on("TerzaSelection", handleTranslation);
                Kimo.Observable.on("TerzaSelection", handleTerzaStats);
                Kimo.Observable.on("TerzaSelection", hideCommentZone);
            },

            hideCommentZone = function () {
        
                if (viewmodeManager.getCurrentMode() === "comment") {
                    viewmodeManager.switchViewMode("terza");
                }
            },
       
            handleTerzaStats = function (html, terzaNo) {
                $.get("/rest/stats/terza/"+terzaNo).done(function (stats){
                    if (stats && stats.hasOwnProperty('translation')) {
                        $("#contrib_stats_label").text(stats.translation);
                    }
                });
            },
                    
            displayTerzaEditor = function () {
                var translationItem = new Models.TranslationItem({}),
                    currentTerza = terzaManager.getCurrentTerza();
                translationItem.set("terza", currentTerza);
                terzaEditor.configure({
                    mode: "create",
                    repository: Models.TranslationRepository,
                    translation: translationItem
                });
                terzaEditor.render("#editor-ctn");
            },

            /* create a stranza editor */
            editContent = function (translationItem, render) {
                if (previousEditedContent) {
                    $(previousEditedContent).show();
                }
                var editorView;
                $(terzaEditor).val(translationItem.get("content"));
                $(render).hide();
                terzaEditor.configure({
                    mode: "edit",
                    translation: translationItem,
                    repository: Models.TranslationRepository,
                    onAction: function (type) {
                        if (type == "cancel" || type == "save") {
                            $(render).show();
                        }
                    }
                });
                editorView = terzaEditor.render();
                $(render).after(editorView);
                previousEditedContent = render;
            },

            showEditTab = function () {
                $('#user-action-tab a[href="#editing"]').tab('show') // Select tab by name
            },

            getApi = function () {
                return {
                    configure: configure,
                    showEditTab: showEditTab
                }
            }
        return getApi();
    })();
    return ContentManager;
});