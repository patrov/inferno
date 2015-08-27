/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
require(["Kimo/core", 'bi.components/commentlist/helper/itemrenderer.helper', 'bi.components/commentlist/view/commentEditor.view'], function(Kimo, ItemRenderer) {

    Kimo.registerEntityView({
        name: "CommentList",

        init: function() {
            this.currentTarget = null;
            this.templatePath = "bi.components/commentlist/templates/";
            this.commentDataView = new Kimo.DataView({
                itemRenderer: $.proxy(ItemRenderer.render, ItemRenderer),
                width: "auto"
            });
            this.commentReposirory = this.entity;
            this.commentEditor = Kimo.createEntityView("CommentEditor", {entity: this.entity});
            this.bindEntityEvents();
        },

        bindEntityEvents: function () {
            this.commentReposirory.on("change", $.proxy(this.handleChange, this)); //must be triggered after create
        },

        handleChange: function (reason, comment) {
            this.commentDataView.updateData(comment.toJson(), reason);
        },

        setTranslation: function (translation) {
            if (this.currentTarget === translation.id) { return false; }
            this.currentTarget = translation.id;
            var currentTranslation = Kimo.TemplateManager.render(this.templatePath + "selectedTranslation.html", {data: translation});
            this.loadTranslationComments(translation);
            this.commentEditor.setTarget(translation);
            $("#trans-ctn").html(currentTranslation);
            this.render();
        },

        bindEditorEvent: function (render) {

        },

        displayCommentEditor: function () {
            this.editor.show();
        },

        loadTranslationComments: function (translation) {
            var self = this;
            this.commentReposirory.getComments(translation).done(function(data) {
                self.commentDataView.setData(data, true);
            });
        },

        render: function() {
            //if (!this.isRendered) {
            this.commentDataView.render("#commentlist-wrapper");
            $("#editor-wrapper").append(this.commentEditor.render());
            //}
            //this.isRendered = true;
        }


    });
});


