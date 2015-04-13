/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */


define([], function() {
    
    
   var CommentsManager = {
       showCommentList: function (comment) {
           var commentHtml = this.attachEvents(comment);
           $(".commentZone").append(commentHtml);
       },
       
       attachEvents: function (commentHtml) {
           $(commentHtml).on("click", ".fa-angle-down", function () {
            alert("radical");
        });
        return commentHtml;
       }
   };
   
   return {
       showCommentList: $.proxy(CommentsManager.showCommentList, CommentsManager)
   }
    
    
    
});