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
                height: $(window).height() - 350,
                scrollToLast: true,
                width: "auto"
            });
            this.commentReposirory = this.entity;
            this.commentEditor = Kimo.createEntityView("CommentEditor", {entity: this.entity});
            this.bindEntityEvents();
        },

        bindEntityEvents: function () {
            var self = this;
            this.commentReposirory.on("change", $.proxy(this.handleChange, this)); //must be triggered after create
            Kimo.Observable.registerEvents(['newComment']);
            Kimo.Observable.on("newComment", function () { 
                self.commentDataView.updateScrollbar();
             });
        },

        handleChange: function (reason, comment) {
            this.commentDataView.updateData(comment.toJson(), reason);
        },

        setTranslation: function (translation, itemHtml) {
            
            this.currentTarget = translation.id;
            var currentTranslation = Kimo.TemplateManager.render(this.templatePath + "selectedTranslation.html", {data: translation});
            this.loadTranslationComments(translation);
            this.commentEditor.setTarget(translation);
            //$("#trans-ctn").html(currentTranslation);
            
            this.render(itemHtml);
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

        render: function(itemHtml) {
            var container = $("<div></div>");
            container.addClass(".comment-zone");
            container.append($("<div class='editor-wrapper'></div>").clone());
            container.append($("<div class='comment-list'></div>").clone());
            this.commentDataView.render(container.find(".comment-list").eq(0));
            $(itemHtml).after(container);
            container.find(".editor-wrapper").eq(0).append(this.commentEditor.render());
        }


    });
});


