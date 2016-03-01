/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */


define(['Kimo/core', 'vendor.moment'], function(Kimo, moment) {

    var ItemRenderer = {
        templatePath: "bi.components/commentlist/templates/",

        attachEvents: function (itemHtml, data){
            return itemHtml;
        },

        render: function(itemData, mode) {
            itemData.pubdate = moment(itemData.pubdate).fromNow();
            var itemRender = Kimo.TemplateManager.render(this.templatePath + "item.html", {data: itemData});
            return this.attachEvents(itemRender, itemData);
        }
    };
    return ItemRenderer;

});