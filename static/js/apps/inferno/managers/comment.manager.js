/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

define(["bi.models", 'bi.components/commentlist/main'], function(Models) {

        CommentsManager = {
             config: null, 
            showCommentList: function(translation) {
                try {
                    if (!this.commentList) {
                        console.log("there", this.config);
                        this.commentList = Kimo.createEntityView("CommentList", {
                            entity: Models.CommentRepository,
                            root : this.config.root
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