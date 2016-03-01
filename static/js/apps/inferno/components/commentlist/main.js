/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
require(["Kimo/core", 'bi.components/commentlist/helper/itemrenderer.helper', 'bi.components/commentlist/view/commentEditor.view'], function(Kimo, ItemRenderer) {

    Kimo.registerEntityView({
        name: "CommentList",
        
        events: {
            ".block-close-btn click": 'destroy'
        },
        
        init: function() {
            
            this.widget = $("<div/>");
            this.widget.addClass("comment-zone");
            this.widget.append($('<p class="block-wrapper"><span class="block-title">Komantè</span> <span class="block-close-btn pointable fa fa-close pull-right"></span></p>'));
            
            this.widget.append($("<div class='comment-list'></div>").clone());
            this.widget.append($("<div class='editor-wrapper'></div>").clone());
            
            this.editorCtn = this.widget.find('.editor-wrapper').eq(0);
            this.commentListCtn = this.widget.find('.comment-list').eq(0);
            this.currentTarget = null;
            this.templatePath = "bi.components/commentlist/templates/";
            
            this.commentDataView = new Kimo.DataView({
                itemRenderer: $.proxy(ItemRenderer.render, ItemRenderer),
                scrollToLast: true,
                width: "auto"
            });
            
            this.commentReposirory = this.entity;
            this.commentEditor = Kimo.createEntityView("CommentEditor", {entity: this.entity, root: this.root});
                
            this.commentDataView.render(this.commentListCtn);
            this.editorCtn.append(this.commentEditor.render());
            this.bindEntityEvents();
        },
        
        onDestroy: function () { 
            this.clear();
        },
        
        bindEntityEvents: function () {
            var self = this;
            
            Kimo.Observable.registerEvents(['newComment']);
            Kimo.Observable.on("newComment", function (comment) { 
                self.commentDataView.updateData(comment, "create");
             });
        },
        
        setTranslation: function (translation, itemHtml) {
            if (this.currentTarget === translation.id) {
                return;
            }
            this.currentTarget = translation.id;
            this.loadTranslationComments(translation);
            this.commentEditor.setTarget(translation);            
            this.render(itemHtml); //show the view after the template
        },

        displayCommentEditor: function () {
            this.editor.show();
        },
        
        clear: function () {
            this.currentTarget = null;
            $(this.widget).remove();
        },
        
        loadTranslationComments: function (translation) {
            var self = this;
            this.commentDataView.reset();
            
            self.commentReposirory.getComments(translation).done(function(data) {
                self.commentDataView.setData(data, true);
            });
        },

        render: function(itemHtml) {
            if (itemHtml) {
                return $(itemHtml).after(this.widget);
            } 
            
            return this.widget;  
        }


    });
});


