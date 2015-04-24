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
            this.root = $(editor).clone();
            this.target = null;
            this.enable = true;
            this.editableField = $("#comment-field", this.root).eq(0);
            this.bindEntityEvents();
        },

        setTarget: function (target) {
            this.target = target;
        },

        bindEntityEvents: function() {
            this.entity.on("save", $.proxy(this.handleChange, this));
        },

        handleChange: function(test) {

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
            $(this.root).hide();
        },

        saveComment: function () {
            this.disableEditor();
            this.entity.create({
                content: this.editableField.html(),
                target: this.target.id
                }).done($.proxy(this.enableEditor, this));
                this.reset();
        },

        render: function () {
            return this.root;
        }
    });

    return CommentView;

});