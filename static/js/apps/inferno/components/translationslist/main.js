/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

define(['Kimo/core', 'text!../translationslist/templates/layout.html', '../translationslist/helper/itemrenderer.helper'], function(Kimo, layout, ItemRenderer) {

    Kimo.registerEntityView({
        name: "TranslationListView",
        init: function() {
            this.root = $(layout).clone();
            ItemRenderer.init(Kimo.ParamsContainer.get("config"));
            this.dataView = new Kimo.DataView({
                itemRenderer: $.proxy(ItemRenderer.render, ItemRenderer),
                emptyItemRenderer: function () {
                    return "<p style='color: orange'><strong>Poko gen tradiksyon...</strong></p>";
                },
                width: 'auto'

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
            this.dataView.render("#list-container");
            this.isRendered = true;
        }
    });

});
