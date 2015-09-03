/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

define(["bi.models", 'bi.components/commentlist/main'], function(Models) {

        CommentsManager = {
             config: null, 
             commentList : null,
             
            showCommentList: function(translation) {
                try {
                    if (!this.commentList) {
                        this.commentList = Kimo.createEntityView("CommentList", {
                            entity: Models.CommentRepository,
                            root : this.config.root,
                            height : $(document).height() - 500
                        });
                    }
                    this.commentList.setTranslation(translation);
                } catch (e) {
                    console.log(e);
                }
            }
    },
    
    getApi = function () {
        return {
            showCommentList: $.proxy(CommentsManager.showCommentList, CommentsManager)
        };
    };
    

    return {
        configure: function (config) { 
            CommentsManager.config = config; 
            return getApi();
        }
    };

});