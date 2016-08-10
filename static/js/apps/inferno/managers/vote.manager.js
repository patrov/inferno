/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */


define(['Kimo/core', "bi.models"], function (Kimo, Models) {

    return {

        upVote: function (translationId) {
            Models.TranslationRepository.findById(translationId).done(function (translation) {
               return translation.like();
            });
        },
        
        clearPreviousVote: function () {
          var selecteditem = Kimo.jQuery("#contribution").find(".fa-star").eq(0);
          var nbVotes = selecteditem.parent().find(".nb-votes").eq(0);
          nbVotes.text( parseInt(nbVotes.text()) - 1 );
          selecteditem.removeClass("fa-star").addClass("fa-star-o");
        },
        /* user has one vote per terza */
        handleVote: function (translationNode) {
            var id = $(translationNode).data('uid'),
                previousVal = parseInt(translationNode.find('.nb-votes').eq(0).text()),
                voteBtn = translationNode.find(".vote-btn").eq(0);
            if (voteBtn.hasClass("fa-star")) {
               translationNode.find('.nb-votes').eq(0).text(previousVal - 1);
              $(voteBtn).removeClass("fa-star").addClass('fa-star-o');
               return this.downVote(id);
            } else {
               this.clearPreviousVote();
               $(voteBtn).removeClass("fa-star-o").addClass('fa-star');
               translationNode.find('.nb-votes').eq(0).text(previousVal + 1 );
               return this.upVote(id)
            }
        },

        downVote: function (translationId) {
            Models.TranslationRepository.findById(translationId).done(function (translation) {
               return translation.disLike();
            });
        }
    };
});