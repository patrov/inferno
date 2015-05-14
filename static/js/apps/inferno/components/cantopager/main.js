/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */


define(['Kimo/core', 'jquery'], function (Kimo) {
    Kimo.registerEntityView({
        name : "CantoPager",
        
        settings: {
            items: 34,
            itemsOnPage: 7,
            selected: 1,
            disabledRange: [2, 'max'],
            ellipsis: "...",
            currentPage: 1,
            itemRenderer: function () {}
        },
        
        init: function () {
            this.root = $("<div/>").clone()
                    .attr("id","canto-pager")
                    .addClass("canto-link-ctn");
            
            if (typeof this.settings.itemRenderer === 'function') {
                this.itemRenderer = this.settings.itemRenderer;
            }
            this.state = { maxPage : Math.ceil( this.settings.items / this.settings.itemsOnPage ) };
            this.select(this.settings.currentPage);
            this.bindEvents();
            /*user event délégation*/
            this.updateUi();
        },
        
        bindEvents : function () {
            $(document).on("click", ".prev-canto", $.proxy(this.prev, this));
            $(document).on("click", ".next-canto", $.proxy(this.next, this));
            $(document).on("click", ".canto-link", $.proxy(this.prev, this));
        },
        
        clickHandler: function (e) {
            var canto = Kimo.jQuery(e.currentTarget).data("canto-no");
            this.state.selected = canto;
            Kimo.jQuery(this.root).find(".selected").removeClass("selected");
            Kimo.jQuery(e.currentTarget).addClass("selected");
            e.selected = canto;
            this.trigger("cantoSelection", e);
        },
                
        itemRenderer : function (no) {
            return Kimo.jQuery("<div>"+no+"</div>").addClass("canto");
        },
                
        next: function () {
            var nextPage = this.state.currentPage + 1;
            this.select(nextPage);
        },
        
        prev: function () {
        var prevPage = this.state.currentPage - 1;
            this.select(prevPage);
        },
                
        select: function(noPage, silent) {
            this.state.currentPage = noPage;
            this.state.range = this._computePages(noPage);
            this.updateUi();
        },
            
        /* allways render currentState */
        updateUi: function () {
            var pagerRender = document.createDocumentFragment(),
                rangeLength = this.state.range.length;
                
            if ( (this.state.maxPage > 1) && (this.state.currentPage > 1) ) {
                var ellipsisBtn = Kimo.jQuery("<div/>").text(this.settings.ellipsis).addClass("prev-canto");
                pagerRender.appendChild(Kimo.jQuery(ellipsisBtn).get(0));
            }
            
            for (var i = 0; i < rangeLength; i++) {
                var item = this.itemRenderer(this.state.range[i]);
                Kimo.jQuery(item).data("canto-no", this.state.range[i]);
                pagerRender.appendChild(Kimo.jQuery(item).get(0));
            }
            
             if (this.state.currentPage < this.state.maxPage) {
                var ellipsisBtn = Kimo.jQuery("<div/>").text(this.settings.ellipsis).addClass("next-canto");
                pagerRender.appendChild(Kimo.jQuery(ellipsisBtn).get(0));
            }
             this.root.html(Kimo.jQuery(pagerRender));   
        },
                
        _computePages: function (start) {
            var nextStart = (start * this.settings.itemsOnPage ) < this.settings.items ? start * this.settings.itemsOnPage: this.settings.items,
            start = nextStart - this.settings.itemsOnPage + 1,
            range = [];
            for (var i = start; i <= nextStart; i++) {
                range.push(i);
            }
            return range;
        },
                    
        render: function (container) {
            if (container) {
                Kimo.jQuery(container).html(this.root);
            }
            return this.root;
        }
        
    });
    
    
});