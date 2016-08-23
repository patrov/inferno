/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
define(['Kimo/core', 'vendor.moment', 'manager!inferno:viewmode', 'manager!inferno:vote'], function(Kimo, moment, ViewModeManager, VoteManager) {

    var ItemRenderer = {
        init: function(settings) {

            this.settings = settings;
            this.templatePath = "apps/inferno/components/translationslist/templates/";
            this.commentField = null;
            this.viewMode = this.settings.mode;
            this.translationManager = ViewModeManager;
       },

        attachEvents: function(item, itemData) {
            item = $(item);
            item.on("click", ".comment-btn", $.proxy(this.showCommentField, this, item, itemData));
            item.on("click", ".add-comment", $.proxy(this.saveComment, this, itemData));
            item.on("click", ".comment-close-btn", $.proxy(this.hideEditor, this));
            item.on("mouseenter", $.proxy(this.showAlertBtn, this));
            item.on("mouseleave", $.proxy(this.hideAlertBtn, this))
            item.on("click", ".alert", this.signalContent.bind(this));
            item.on("click", ".vote-btn", this.doVote.bind(this));
            return item;
        },
        
        showAlertBtn: function (e) {
            $(e.currentTarget).find(".alert-btn").css("visibility", "visible");
        },

        hideAlertBtn: function (e) {
            $(e.currentTarget).find(".alert-btn").css("visibility", "hidden");
        },

        signalContent: function (e) {
            alert("radcail");
        },

        doVote: function (e) {
            /* check content */
            var currentTranslation = $(e.currentTarget).closest('.item').eq(0);
            VoteManager.handleVote(currentTranslation);
            
        },

        showCommentField: function(itemHtml, item) {
            
           /* if (this.translationManager.getCurrentMode() === "comment") {
                Kimo.Observable.trigger("EnterCommentMode", item, itemHtml);
                return;
            }*/
            //this.translationManager.switchViewMode("comment");
            Kimo.Observable.trigger("EnterCommentMode", item, itemHtml);
        },

        hideEditor: function() {
            $("#comment-wrapper").remove();
        },

        saveComment: function(itemData, e) {
            e.preventDefault();
            var content = $("#comment-field").val(),
                    data = {target: itemData.uid, content: content};
            /* save comment here */
            this.hideEditor();
        },

        render: function(itemData, mode) {
            itemData.pubdate = moment(itemData.pubdate).fromNow();
            var itemRender = Kimo.TemplateManager.render(this.templatePath + this.viewMode + ".item.html", {data: itemData});
            return this.attachEvents(itemRender, itemData);
        }
    };

    return ItemRenderer;
});

