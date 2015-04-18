/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

define(["bi.models", 'bi.components/commentlist/main'], function(Models) {

    var CommentsManager = {
        
        showCommentList: function(translation) {
            try {
                if (!this.commentList) {
                    this.commentList = Kimo.createEntityView("CommentList", {
                        entity: Models.CommentRepository
                    });
                }
                this.commentList.setTranslation(translation);
            } catch (e) {
                console.log(e);
            }
        }
    };

    return {
        showCommentList: $.proxy(CommentsManager.showCommentList, CommentsManager)
    };

});