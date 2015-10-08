/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */


define(['Kimo/core', "bi.models"], function (Kimo, Models) {

    return {
        like: function (translationId) {

            Models.TranslationRepository.findById(translationId).done(function (translation) {
               translation.like();
            });
        },

        dislike: function (translation) {
            return translation.dislike();
        }
    };
});