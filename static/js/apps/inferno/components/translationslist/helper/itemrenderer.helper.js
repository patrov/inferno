/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
define(['Kimo/core', 'manager!inferno:viewmode'], function(Kimo, ViewModeManager) {

    var ItemRenderer = {
        init: function(settings) {
            this.templatePath = "apps/inferno/components/translationslist/templates/";
            this.commentField = null;
            this.translationManager = ViewModeManager;
       },
               
        attachEvents: function(item, itemData) {
            item = $(item);
            item.on("click", ".show-comment", $.proxy(this.showCommentField, this, item, itemData));
            item.on("click", ".add-comment", $.proxy(this.saveComment, this, itemData));
            item.on("click", ".comment-close-btn", $.proxy(this.hideEditor, this));
            return item;
        },
                
        showCommentField: function(itemHtml, item) {
            if (this.translationManager.getCurrentMode() === "comment") { 
                Kimo.Observable.trigger("EnterCommentMode", item);
                return; 
            }
            this.translationManager.switchViewMode("comment");
            Kimo.Observable.trigger("EnterCommentMode", item);
        },
                
        hideEditor: function() {
            $("#comment-wrapper").remove();
        },
                
        appendNewComment: function(commentItem) {

        },
                
        saveComment: function(itemData, e) {
            e.preventDefault();
            var content = $("#comment-field").val(),
                    data = {target: itemData.uid, content: content};
            /* save comment here */
            this.hideEditor();
        },
                
        render: function(itemData, mode) {
            var itemRender = Kimo.TemplateManager.render(this.templatePath + "item.html", {data: itemData});
            return this.attachEvents(itemRender, itemData);
        }
    };

    return ItemRenderer;
});

