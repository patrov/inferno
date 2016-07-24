/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

define(["Kimo/core", "vendor.mustache", "vendor.moment"], function(Kimo, Mustache, Moment) {

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
            this.widget = Kimo.jQuery("<div/>").clone();
            this.translationRepository = this.entity;
            this.selectedTranslation = null;
            this.translationRepository.on("save", $.proxy(this.handleContentChange, this));
            this.translationRepository.on("change", $.proxy(this.handleContentChange, this));
            this.test ='harris';

            this.root = this.widget;
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
            $(this.widget).find(".contrib-actions").remove();
        },
        handleContentChange: function(reason, translation) {
            var html = "...";
            html = $(Mustache.render(translationItemTpl, translation.toJson()));
            if (translation.getState() == 0) {
                $(html).data("state", "draft");
                $(html).data("translation", translation.getCid());
            }

            if (reason == "create") {
                this.widget.append($(html));
                this.updateContentCount();
                $(this.selectedTranslation).replaceWith(html);
            }

            if (reason == "remove") {
                $(this.selectedTranslation).remove();
                this.updateContentCount();
            }
        },
        updateContentCount: function() {
            var ctn = parseInt($(this.widget).find(".contrib").length);
            $(".content-badge").html(ctn);
        },
        render: function() {
            return this.widget;
        }

    });

    /* terzaView with Editor */

    Kimo.registerEntityView({
        CREATE_MODE: "create",
        EDIT_MODE: "edit",
        SHOW_MODE: "show",
        name: "terzaEditorView",
        events: {
            "#cancel-btn click": "doCancel",
            "#save-draft-btn click": "doSave",
            ".fa-edit click": "doEdit",
            ".fa-remove click": "doDelete"
        },
        templateMap: {
            contrib: "bi.templates/terzaEditor.contrib.html",
            view: "bi.templates/terzaEditor.view.html"
        },
        init: function() {
            this.widget = $("<div/>").clone();
            this.widget.append(Kimo.TemplateManager.render(this.templateMap[this.viewMode], {onRender: this.onTemplateReady.bind(this)}));
            this.isVisible = false;
            this.root = this.widget;
            console.log(this.viewMode);
        },

        onTemplateReady: function() {
            this.editor = $(this.widget).find("#edit-zone");
            this.widget.find(".btn").hide();
            this.userTranslationCtn = $(this.widget).find("#user-translation-text");
            this.emptyTranslationPanel = $(this.widget).find(".empty-panel");
            this.editFields = $(this.widget).find(".edit-field");
            this.pubdateField = $(this.widget).find("#user-contrib-pubdate");
            this.panels = $(this.widget).find(".editing-panel");
        },
        bindEvents: function() {
            var self = this;
            if (!this.repository) {
                return false;
            }

            this.repository.on("change", function(reason, entity) {
                if (reason === "create") {
                    self.setTranslation(entity);
                }

                if (reason === "remove") {
                    self.onAction('delete');
                }
            });
            this.bindEvents = $.noop;
        },
        doDelete: function() {
            if (!this.translationItem) {
                return;
            }

            if (this.repository) {
                try {
                    this.repository.remove(this.translationItem);
                } catch (e) {
                    this.repository.add(this.translationItem, true, false);
                    this.doDelete();
                }

            }

        },
        configure: function(config) {
            this.onAction = (typeof config.onAction == "function") ? config.onAction : Kimo.jQuery.noop;

            if (config.repository) {
                this.repository = config.repository;
            }

            this.widget.find(".btn").hide();
            this.currentMode = config.mode;

            if (this.currentMode === this.CREATE_MODE) {
                this.widget.find("#save-draft-btn, #propose-btn, #cancel-btn").show();
            }
            
            if (this.currentMode === this.EDIT_MODE) {
                this.widget.find("#save-draft-btn, #cancel-btn").show();
            }

            if (this.currentMode === this.SHOW_MODE) {
                this.widget.find(".current-translation").hide();
                this.widget.find(".fa-edit").hide();
                this.widget.find(".fa-remove").hide();
                this.setTerza(config.currentTerza);
            }

            if (config.translation) {
                this.setTranslation(config.translation);
            }
 
            this.bindEvents();
        },
        doEdit: function() {
            this.showEditForm();
        },
        showUserTranslation: function() {
            if (this.translationItem.isEmpty()) { return false; }
            this.widget.find(".user-translation").show();
        },
        showEditForm: function() {
            $(this.editFields).hide();
            $(this.editor).val(this.translationItem.get("content"));
            this.widget.find(".stz-editor").show();
        },
        setTranslation: function(translationItem) {
            if (!translationItem || typeof translationItem.set !== "function") {
                return;
            }

            /* hide all fields */
            $(this.editFields).hide();
            this.hidePanels();
            this.translationItem = translationItem;
            if (this.translationItem.isEmpty()) {
                if (this.isEditMode()) {
                    if (this.viewMode === "view") {
                        this.hideProposeBtn();
                    }
                    $(this.editor).val(translationItem.get("content"));
                    this.showEditForm();
                } else {
                    this.showEmptyTransaltionPanel();
                }

            } else {
                this.userTranslationCtn.html(translationItem.get("content"));
                this.pubdateField.html(Moment(translationItem.get("pubdate")).fromNow());
                this.showUserTranslation();
            }
        },
        hideProposeBtn: function() {
            this.widget.find("#propose-btn").hide();
        },
        isShowMode: function() {
            return this.currentMode === this.SHOW_MODE;
        },
        hidePanels: function() {
            this.panels.hide();
        },
        showEmptyTransaltionPanel: function() {
            this.emptyTranslationPanel.show();
        },
        isEditMode: function() {
            return this.currentMode === this.EDIT_MODE;
        },
        setTerza: function(terza) {
            this.currentTerza = terza;
        },
        setTerzaRender: function(terzaNode) {
            $(this.widget).find('.current-translation').html(terzaNode);
        },
        hide: function() {
            $(this.widget).hide();
            this.onAction("hide");
        },
        show: function() {
            (this.widget).show();
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
            //if (container && !this.isVisible) {
            $(container).html(this.widget);
            this.isVisible = true;
            return;
            // }
        }

    });


});
