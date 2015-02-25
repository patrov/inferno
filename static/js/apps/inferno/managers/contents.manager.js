/***
 * handle save
 */
define(["Kimo/core","require", "bi.models", "bi.terza.manager", "bi.views"], function (Kimo, require, Models, terzaManager) {
    
    var ContentManager = (function () {
        var config = {
            "editZone": "#edit-zone",
            contentTpl: "<p class='stz'>{{content}} <span><strong>Mwen menm</strong></span></p>"
        },
        currentTerza = null,
        terzaEditor = null,
        terzaNode = null,
        previousEditedContent = null,
        configure = function (userConfig) {
            $.extend(true, config, userConfig);			
            //terzaEditor = $("#edit-zone");
            /* user contentManager */
            var translationsView = Kimo.createEntityView("TranslationsView", {
                entity: Models.TranslationRepository,
                contentBadge: ".content-badge"
            });
            
            terzaEditor = Kimo.createEntityView("terzaEditorView",{});
            $("#contributions").html(translationsView.render());
            bindEvents();
        },
        
        setCurrentTerza = function (html, no) { 
            currentTerza = no;
            terzaNode = html;
            terzaEditor.setTerzaRender($(terzaNode).html());
        }, 
        
         loadTranslation = function (noTerza) {
           return $.ajax({url:"/rest/translation?terza="+noTerza});
        },
        
        handleTranslation = function (html, noTerza) {
            try {
                loadTranslation(noTerza).done(function (response) {
                    console.log("response", response);
             });
            } catch(e) {
                console.log(e);
            }
            
        },
       
        bindEvents = function () {
            Kimo.Observable.registerEvents(['TranslationEditTask','TerzaSelection']);//strange voodou
            Kimo.Observable.on("TranslationEditTask", editContent);
            Kimo.Observable.on("TerzaSelection", setCurrentTerza);
            Kimo.Observable.on("TerzaSelection", handleTranslation);
            $(config.root).on('click','#add-translation', displayTerzaEditor);
        },
        
        displayTerzaEditor = function () {
            var translationItem = new Models.TranslationItem({}),
            currentTerza = terzaManager.getCurrentTerza(); 
            translationItem.set("terza", currentTerza);
            terzaEditor.configure({
                mode:"create", 
                repository: Models.TranslationRepository,
                translation :translationItem, 
                onAction: function (action) {
                    //show the button
                    if (action=="cancel" || action=="hide") {
                        $("#add-translation").show();
                    }
                }
            }); 
            $("#add-translation").hide();
            if($("#editor-ctn").find("#editing-zone").length){
                $("#editing-zone").show();
            }else{
                $("#editor-ctn").html(terzaEditor.render());
            }
        },
        
        /* create a stranza editor */
        editContent = function (translationItem, render) { 
            if(previousEditedContent){
                $(previousEditedContent).show();
            }
            var editorView;
            $(terzaEditor).val(translationItem.get("content"));
            $(render).hide();
            terzaEditor.configure({
                mode:"edit", 
                translation : translationItem, 
                repository: Models.TranslationRepository,
                onAction: function (type) {
                    if(type=="cancel" || type=="save"){
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
        
        
        saveContent = function () {
        /* var currentterza = stzManager.getCurrentterza();
            if(parseInt(currentterza)== NaN) return;
            var curTranslation = $(config.editZone).val();
            var translationItem = new Models.TranslationItem({
                content:curTranslation
            });
            translationItem.set("terza", currentterza);
            translationItem.set("date", new Date().getTime());
            Models.TranslationRepository.add(translationItem);*/
        },

        getApi = function () {
            return {
                configure: configure,
                showEditTab : showEditTab
            }
        }
        return getApi();
    })();
    return ContentManager;
});