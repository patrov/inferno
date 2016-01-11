/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

define(['Kimo/core', '../translationslist/helper/itemrenderer.helper'], function(Kimo, ItemRenderer) {

    Kimo.registerEntityView({

        name: "TranslationListView",

        init: function() {
            this.root = $("<div/>").clone();
            ItemRenderer.init(Kimo.ParamsContainer.get("config"));

            this.dataView = new Kimo.DataView({
                itemRenderer: $.proxy(ItemRenderer.render, ItemRenderer),
                idKey: 'uid',
                emptyItemRenderer: function () {
                    return "<p style='color: orange'><strong>Poko gen tradiksyon...</strong></p>";
                },
                width: 'auto',
                height: this.height + "px"
            });

            this.isRendered = false;
            this.translationRepository = this.entity;
        },

        loadTranslations: function(terza) {
            var self = this;
            this.translationRepository.getContributions(terza).done(function(data) {
                self.dataView.setData(data, true);
           });
        },

        refresh: function () {
            this.dataView.updateScrollbar();
        },
        
        setTerza: function(terza) {
            if(terza && (this.currentTerza !== terza)) {
                this.currentTerza = terza;
                this.loadTranslations(terza);
            }
        },

        render: function(container, method) {
            if(this.isRendered) {return;}
            if (typeof $.fn[method] === "function") {
                $(container)[method](this.root);
            } else {
                $(container).append(this.root);
            }
            this.dataView.render("#translation-ctn");
            this.isRendered = true;
        }
    });

});
