/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

define(['Kimo/core', 'text!../translationslist/templates/layout.html', '../translationslist/helper/itemrenderer.helper'], function(Kimo, layout, ItemRenderer) {

    Kimo.registerEntityView({
        name: "TranslationListView",
        init: function() {
            this.root = $(layout).clone();
            ItemRenderer.init({});
            this.dataView = new Kimo.DataView({
                itemRenderer: $.proxy(ItemRenderer.render, ItemRenderer),
                width: 'auto'
            });
            this.isRendered = false;
            this.translationRepository = this.entity;
        },
                
       /* bindEvents: function() {
            this.translationRepository.on("create", function() {
                alert("this is it");
                console.log("argurments", arguments);
            });
        },*/
                
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