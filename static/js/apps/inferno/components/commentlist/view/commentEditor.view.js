/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */


require(["Kimo/core", "text!bi.components/commentlist/templates/comment.editor.html"], function (Kimo, editor) {
    var CommentView =  Kimo.registerEntityView({
        name: "CommentEditor",
        events: {
            ".add-comment click": "saveComment"
        },

        init: function () {
            this.currentValue = "";
            this.widget = $(editor).clone();
            this.target = null;
            this.enable = true;
            this.editableField = $("#comment-field", this.widget).eq(0);
        },

        setTarget: function (target) {
            this.target = target;
        },
        
        disableEditor: function () {
            this.enable = false;
            return this;
        },

        enableEditor: function () {
            this.enable = true;
            return this;
        },

        reset: function () {
            this.editableField.html("");
        },

        isEnable: function () {
            return this.enable === true;
        },

        hide: function () {
            $(this.widget).hide();
        },

        saveComment: function () {
            this.disableEditor();
            var commentHtml = this.editableField.html();
            
            this.entity.create({
                content: commentHtml,/*result.join("\n"),*/
                target: this.target.id
                }).done(function (data) {
                    Kimo.Observable.trigger("newComment", data);
                });
                this.reset();
        },

        render: function () {
            return this.widget;
        }
    });

    return CommentView;

});