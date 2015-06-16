/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */


define(['Kimo/core'], function(Kimo) {
    
    var ItemRenderer = {
        templatePath: "bi.components/commentlist/templates/",
        
        attachEvents: function (itemHtml, data){
            return itemHtml;
        },
                
        render: function(itemData, mode) {
            var itemRender = Kimo.TemplateManager.render(this.templatePath + "item.html", {data: itemData});
            return this.attachEvents(itemRender, itemData);
        }
    };
    return ItemRenderer;

});