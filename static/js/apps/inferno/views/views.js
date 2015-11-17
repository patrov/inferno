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
            alert("read");
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
            this.widget.append(Kimo.TemplateManager.render(this.templateMap[this.viewMode], { onRender : this.onTemplateReady.bind(this) }));
            this.isVisible = false;
            this.root = this.widget;
        },

        onTemplateReady: function () {
            this.editor = $(this.widget).find("#edit-zone");
            this.widget.find(".btn").hide();
            this.userTranslationCtn = $(this.widget).find("#user-translation-text");
            this.editFields = $(this.widget).find(".edit-field");
            this.pubdateField = $(this.widget).find("#user-contrib-pubdate");
        },

        bindEvents: function() {
            var self = this;
            this.repository.on("change", function (reason, entity) {
                if (reason === "create") {
                    self.setTranslation(entity);
                }
                if (reason === "remove") {
                   
                }
            });
            this.bindEvents = $.noop;
        },

        doDelete: function () {
          if (!this.translationItem) { return; }

          if (this.repository) {
              this.repository.remove(this.translationItem);
          }

        },

        configure: function(config) {
            this.onAction = (typeof config.onAction == "function") ? config.onAction : function() {
            };
            this.repository = config.repository;
            this.widget.find(".btn").hide();

            if (config.mode == this.CREATE_MODE) {
                this.widget.find("#save-draft-btn, #propose-btn, #cancel-btn").show();
            }
            if (config.mode == this.EDIT_MODE) {
                this.widget.find("#save-draft-btn, #cancel-btn").show();
            }
            if (config.mode == this.SHOW_MODE) {
                this.widget.find(".current-translation").hide();
                this.widget.find(".fa-edit").hide();
                this.widget.find(".fa-remove").hide();
            }
            this.bindEvents();
        },

        doEdit: function() {
            this.showEditForm();
        },

        showUserTranslation: function() {
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
            this.translationItem = translationItem;
            if (this.translationItem.isEmpty()) {
                $(this.editor).val(translationItem.get("content"));
                this.showEditForm();
            } else {
                this.userTranslationCtn.html(translationItem.get("content"));
                this.pubdateField.html(Moment(translationItem.get("pubdate")).fromNow());
                this.showUserTranslation();
            }
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
