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
                    var translationsView = Kimo.createEntityView("TranslationsView", {
                        entity: Models.TranslationRepository,
                        root: config.root,
                        mode: config.mode,
                        contentBadge: ".content-badge"
                    });

                    terzaWidget = Kimo.createEntityView("terzaEditorView", {
                        root: config.root,
                        viewMode: config.viewMode
                    });

                    terzaEditorForm = Kimo.createEntityView("terzaEditorView", {
                        entity: Models.TranslationRepository,
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
                showUserTranslation = function(transalation) {

                    currentTerza = terzaManager.getCurrentTerza();

                    /* Display the widget */
                    container = "#editor-ctn";

                    terzaWidget.setTranslation(transalation);
                    terzaWidget.configure({
                        mode: "show",
                        currentTerza: currentTerza
                    });

                    terzaWidget.render(container);
                },
				
                displayUserContributions = function(html, terza) {
					if (!terza) { return; }
                    translationList.setTerza(terza);
                    translationList.render("#translation-ctn");
                },
				
                loadTranslation = function(noTerza) {
					return $.ajax({
                        url: "/rest/translation?terza=" + noTerza
                    });
                },
				
                handleTranslation = function(html, noTerza) {
					
					if (!noTerza) { return; }
					
					var currentLang = Kimo.ParamsContainer.get("currentLang");
					if (currentLang === KREYOL) {
						return false;
					}
					loadTranslation(noTerza).done(function(response) {

						var translation = new Models.TranslationItem(response);
						if (translation.isEmpty()) {
							translation.set("canto", parseInt(Kimo.ParamsContainer.get("currentCanto")));
						}
						
						// show the edit widget
						terzaEditorForm.setTranslation(translation);
						// show user contribution
						showUserTranslation(translation);
					});
				}, 

            
                bindEvents = function() {
                    Kimo.Observable.registerEvents(['TranslationEditTask', 'TerzaSelection']);
                    Kimo.Observable.on("TerzaSelection", handleTranslation);// 
                    Kimo.Observable.on("TerzaSelection", handleTerzaStats); // displayStats
                    Kimo.Observable.on("TerzaSelection", hideCommentZone); //  hide Comment Zone if visible
                    Kimo.Observable.on("TerzaSelection", showEditorForm);
					Kimo.Observable.on("TerzaSelection", displayUserContributions); // contributions
					Models.TranslationRepository.on("change", handleUserContribution);
                },
				
				handleUserContribution = function (reason, translation) {
					translation = (reason !== 'remove') ?  translation :  new Models.TranslationItem({});
					showUserTranslation(translation);
					
					if (translation.isEmpty()) {
						translation.set("canto", parseInt(Kimo.ParamsContainer.get("currentCanto")));
						terzaEditorForm.setTranslation(translation);
					}
				},
				
                /*
                 * show edition actions
                 **/
                showEditorForm = function(clonedNode, noTerza, currentSelection) {
					var currentLang = Kimo.ParamsContainer.get("currentLang");
					if (currentLang === KREYOL) {
						return false;
					}
                    //return;
                    if (previousSelection) {
                        $(previousSelection).show();
                    }
                    var ctn = $("<div/>"),
						terzaItem = currentSelection.parent(".terza-item").eq(0);
					
                    displayTerzaForm(clonedNode, ctn);
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
					
					if (!terzaNo) { return false; }
					
                    $.get("/rest/stats/terza/" + terzaNo).done(function(stats) {
                        if (stats && stats.hasOwnProperty('translation')) {
                            $("#contrib_stats_label").text(stats.translation);
                        }
                    });
                },
                
                displayTerzaForm = function(terzaNode, ctn) {
                    
                    var translationItem = new Models.TranslationItem({}),
                            currentTerza = terzaManager.getCurrentTerza();

                    translationItem.set("terza", currentTerza);

                    terzaEditorForm.setTerzaRender($(terzaNode).html());
                    terzaEditorForm.setTerza(currentTerza);

                    if (terzaEditorForm) {
                        terzaEditorForm.configure({
                            mode: "edit",
                            repository: Models.TranslationRepository,
                            translation: translationItem
                        });
                        terzaEditorForm.render(ctn);
                    }
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