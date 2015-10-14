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

        handleVote: function (translationNode) {
            var id = $(translationNode).data('uid'),
                previousVal = parseInt(translationNode.find('.nb-vote').text()),
                voteBtn = translationNode.find(".vote-btn").eq(0);

            if (voteBtn.hasClass("fa-star")) {
               $(voteBtn).removeClass("fa-star").addClass("fa-star-o");
               translationNode.find('.nb-vote').eq(0).text(previousVal - 1);
               return this.downVote(id);
            } else {
               $(voteBtn).removeClass("fa-star-o").addClass('fa-star');
               translationNode.find('.nb-vote').eq(0).text(previousVal + 1 );
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