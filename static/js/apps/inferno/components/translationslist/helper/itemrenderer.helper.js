/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
define(['Kimo/core'], function (Kimo) {
    
    var ItemRenderer = {
        
        init: function (settings) {
            this.templatePath = "apps/inferno/components/translationslist/templates/";
            this.commentField = null;
        }, 
        
        attachEvents: function (item, itemData) {
           item = $(item);
           item.on("click", ".show-comment", $.proxy(this.showCommentField, this, itemData, item));
           item.on("click", ".add-comment", $.proxy(this.saveComment, this, itemData));
           item.on("click", ".comment-close-btn", $.proxy(this.hideEditor, this));
           return item;
        },
                
        showCommentField: function (itemData, item) {
          $("#comment-wrapper").remove();
          var comment = Kimo.TemplateManager.render(this.templatePath+"comment-editor.html");
          $(item).find(".trad-sugg").append(comment);
          $("#comment-wrapper").show();
        },
                
        hideEditor: function () {
            $("#comment-wrapper").remove();
        },     
                
        saveComment: function (itemData, e) {
            e.preventDefault();
            var content = $("#comment-field").val(),
                data = {target: itemData.uid, content: content};
                /* save comment here */
            this.hideEditor();
        },
                
        render: function(itemData, mode) {
           var itemRender = Kimo.TemplateManager.render(this.templatePath+"item.html", { data : itemData});
           return this.attachEvents(itemRender, itemData);
        }
    };
    
    return ItemRenderer;
});

