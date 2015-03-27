/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

define(['Kimo/core', 'text!../translationslist/templates/layout.html', '../translationslist/helper/itemrenderer.helper'], function(Kimo, layout, ItemRenderer) {

    Kimo.registerEntityView({
        name: "TranslationListView",
        init: function() {
            this.root = $(layout).clone();
            ItemRenderer.init();
            this.dataView = new Kimo.DataView({
                itemRenderer: $.proxy(ItemRenderer.render, ItemRenderer),
                width: 'auto'
            });
            this.translationRepository = this.entity;
            this.loadTranslations();
        },
        bindEvents: function() {
            this.translationRepository.on("create", function() {
                console.log("argurments", arguments);
            });
        },
        loadTranslations: function() {
            var self = this;
            this.translationRepository.getContributions(1).done(function(data) {
                self.dataView.setData(data, true);
           });
        },
        render: function(container, method) {
            if (typeof $.fn[method] === "function") {
                $(container)[method](this.root);
            } else {
                $(container).append(this.root);
            }
            this.dataView.render("#list-container");
        }
    });

});
