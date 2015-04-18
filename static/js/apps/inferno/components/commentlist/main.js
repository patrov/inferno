/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
require(["Kimo/core", 'bi.components/commentlist/helper/itemrenderer.helper'], function(Kimo, ItemRenderer) {

    Kimo.registerEntityView({
        name: "CommentList",
        
        init: function() {
            this.isRendered = false;
            this.commentDataView = new Kimo.DataView({
                itemRenderer: $.proxy(ItemRenderer.render, ItemRenderer),
                width: "auto"
            });
            this.commentReposirory = this.entity;
        },
        
        setTranslation: function (translation) {
            this.loadTranslationComments(translation);
            this.render();
        },
                
        loadTranslationComments: function (translation) {
            var self = this;
            this.commentReposirory.getComments(translation).done(function(data) {
                self.commentDataView.setData(data, true);
            });
        },      
        
        render: function() {
            if (!this.isRendered) {
                this.commentDataView.render("#commentlist-wrapper");
            }
            this.isRendered = true;
        }


    });
});


