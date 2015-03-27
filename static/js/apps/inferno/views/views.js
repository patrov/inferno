/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

define(["Kimo/core", "vendor.mustache", "text!bi.templates/editorTpl.html"], function(Kimo, Mustache, biTpl) {

    var translationItemTpl = "<p class='contrib'>{{{content}}}</p>";
    var itemActions = "<div class='contrib-actions'>\n\
            <a class='contrib-action'><i class='fa fa-pencil'></i> </a>\n\
            <a class='contrib-action'><i class='fa fa-remove'></i> </a>\n\
            <a class='contrib-action'><i class='fa fa-share'></i> </a>\n\
        </div>";

    Kimo.registerEntityView({
        name: "TranslationsView",
       events: {
            ".contrib mouseenter": "showActions",
            ".contrib mouseleave": "hideActions",
            ".fa-pencil click": "showEditForm",
            ".fa-remove click": "deleteDraft"
        },
        init: function() {
            this.root = $("<div/>");
            this.translationRepository = this.entity;
            this.selectedTranslation = null;
            this.translationRepository.on("save", $.proxy(this.handleContentChange, this));
            this.translationRepository.on("change", $.proxy(this.handleContentChange, this));
            this.translationRepository.getAll({
                triggerCreateEvent: true
            }).done($.proxy(this.populate, this));
        },
        showEditForm: function() {
        },
        editDraft: function(e) {
            this.selectedTranslation = $(e.currentTarget).closest(".contrib").eq(0);
            var entity = this.translationRepository.findByCid($(this.selectedTranslation).data("translation"));
            Kimo.Observable.trigger("TranslationEditTask", entity, this.selectedTranslation);
        },
        deleteDraft: function(e) {
            this.selectedTranslation = $(e.currentTarget).closest(".contrib").eq(0);
            if (!confirm("Efase?")) {
                return;
            }
            var entity = this.translationRepository.findByCid($(this.selectedTranslation).data("translation"));
            this.translationRepository.remove(entity);
        },
        showActions: function(e) {
            var item = e.currentTarget;
            $(item).append(itemActions);
        },
        hideActions: function(e) {
            var item = e.currentTarget;
            $(this.root).find(".contrib-actions").remove();
        },
        handleContentChange: function(reason, translation) {
            var html = "...";
            html = $(Mustache.render(translationItemTpl, translation.toJson()));
            if (translation.getState() == 0) {
                $(html).data("state", "draft");
                $(html).data("translation", translation.getCid());
            }

            if (reason == "create") {
                this.root.append($(html));
                this.updateContentCount();
            }

            if (reason == "create") {
                $(this.selectedTranslation).replaceWith(html);
            }
            if (reason == "remove") {
                $(this.selectedTranslation).remove();
                this.updateContentCount();
            }
        },
        updateContentCount: function( ) {
            var ctn = parseInt($(this.root).find(".contrib").length);
            $(".content-badge").html(ctn);
        },
        render: function() {
            return this.root;
        }

    });

    /* terzaView with Editor */

    Kimo.registerEntityView({
        CREATE_MODE: "create",
        EDIT_MODE: "edit",
        name: "terzaEditorView",
        events: {
            "#cancel-btn click": "doCancel",
            "#save-draft-btn click": "doSave",
            ".fa-edit click": "doEdit",
            //".fa-remove click": "deDelete"
        },
                
        init: function() {
            this.root = $(biTpl).clone();
            this.root.find(".btn").hide();
            this.editor = $(this.root).find("#edit-zone");
            this.userTranslationCtn = $(this.root).find("#user-translation-text");
            this.editFields = $(this.root).find(".edit-field");
            this.isVisible = false;
        },
        
        bindEvents: function() {
            var self = this;
            this.repository.on("change", function (reason, entity) {
                if(reason=="create") {
                    self.setTranslation(entity);
                }
            });
            this.bindEvents = $.noop;
        },        
        configure: function(config) {
            this.onAction = (typeof config.onAction == "function") ? config.onAction : function() {
            };
            this.repository = config.repository;
            this.root.find(".btn").hide();

            if (config.mode == this.CREATE_MODE) {
                this.root.find("#save-draft-btn, #propose-btn, #cancel-btn").show();
            }

            if (config.mode == this.EDIT_MODE) {
                this.root.find("#save-draft-btn, #cancel-btn").show();
            }
            this.bindEvents();
        },
        doEdit: function() {
            this.showEditForm();
        },
                
        showUserTranslation: function() {
            this.root.find(".user-translation").show();
            
        },
        showEditForm: function() {
            $(this.editFields).hide();
            $(this.editor).val(this.translationItem.get("content"));
            this.root.find(".stz-editor").show();
        },
        setTranslation: function(translationItem) {
            if (!translationItem || typeof translationItem.set !== "function") {
                return;
            }
            /* hide all fields */
            $(this.editFields).hide();
            this.translationItem = translationItem;
            if (this.translationItem.isEmpty()) {
                $(this.editor).val(translationItem.get("content"));
                this.showEditForm();
            } else {
                this.userTranslationCtn.html(translationItem.get("content"));
                this.showUserTranslation();
            }
        },
        setTerza: function(terza) {
            this.currentTerza = terza;
        },
        setTerzaRender: function(terzaNode) {
            $(this.root).find('.current-translation').html(terzaNode);
        },
        hide: function() {
            $(this.root).hide();
            this.onAction("hide");
        },
        show: function() {
            (this.root).show();
            this.onAction("show");
        },
        isVisible: function() {
            return this.isVisible;
        },
                
        doCancel: function(e) {
            $(this.editFields).hide();
            this.showUserTranslation();
            this.onAction("cancel");
        },
        doSave: function() {
            var content = $(this.editor).val();
            this.translationItem.set("content", content);
            this.translationItem.set("state", 1);//draft
            this.translationItem.set("terza", this.currentTerza);
            this.repository.create(this.translationItem.toJson());
            /*whait and show the new translation*/            
            this.onAction("save");
        },
        render: function(container) {
            this.show();
            if (container && !this.isVisible) {
                $(container).html(this.root);
                this.isVisible = true;
                return;
            }
        }

    });


});
