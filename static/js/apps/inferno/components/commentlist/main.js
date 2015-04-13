/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
require(["Kimo/core", '../translationslist/helper/itemrenderer.helper'], function(Kimo, ItemRenderer) {

    Kimo.registerEntityView({
        name: "CommentList",
        
        init: function() {
            this.isRendered = false;
            this.commentDataView = new Kimo.DataView({
                itemRenderer: $.proxy(ItemRenderer.render, ItemRenderer)
            });
        },
                
        render: function(container, method) {
            return "<p>this is the way thing should work ...!</p>";
            this.commentDataView.render("#list-container");

        }


    });
});


