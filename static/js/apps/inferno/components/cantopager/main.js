/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */


define(['Kimo/core', 'jquery'], function(Kimo, jQuery) {
    Kimo.registerEntityView({
        name: "CantoPager",

        events: {
            ".prev-canto click": "prev",
            ".next-canto click": "next",
            ".canto-link click": "clickHandler"
        },

        settings: {
            items: 34,
            itemsOnPage: 7,
            selected: 1,
            disabledRange: [2, 'max'],
            ellipsis: "...",
            currentPage: 1,
            selectedCls: "selected"
        },

        init: function() {
            this.widget = $("<div/>").clone()
                    .attr("id", "canto-pager")
                    .addClass("canto-link-ctn");
            this.registerEvents(['cantoSelection']);
            if (typeof this.settings.itemRenderer === 'function') {
                this.itemRenderer = this.settings.itemRenderer;
            }
            this.silentNextEvent = false;
            this.state = {maxPage: Math.ceil(this.settings.items / this.settings.itemsOnPage)};
            this.state.selected = this.settings.selected;
            this.select(this.settings.currentPage);
        },

        clickHandler: function(e) {
            var canto = Kimo.jQuery(e.currentTarget).data("canto-no");
            this.state.selected = canto;
            Kimo.jQuery(this.widget).find(".selected").removeClass("selected");
            Kimo.jQuery(e.currentTarget).addClass("selected");
            this.trigger("cantoSelection", e, canto);
        },

        itemRenderer: function(no) {
            return jQuery("<div>" + no + "</div>").addClass("canto-link");
        },

        next: function() {
            var nextPage = this.state.currentPage + 1;
            this.select(nextPage);
        },

        prev: function() {
            var prevPage = this.state.currentPage - 1;
            this.select(prevPage);
        },

        selectCanto: function(no) {
            this.state.selected = no;
            var currentPage = Math.ceil(no / this.settings.itemsOnPage);
            this.select(currentPage);
        },

        select: function(noPage, silent) {
            this.state.currentPage = noPage;
            this.silentNextEvent = silent || false;
            this.state.range = this._computePages(noPage);
            this.updateUi();
        },

        /* always render currentState */
        updateUi: function() {
            var pagerRender = document.createDocumentFragment(),
                    rangeLength = this.state.range.length;

            if ((this.state.maxPage > 1) && (this.state.currentPage > 1)) {
                var ellipsisBtn = Kimo.jQuery("<div/>").text(this.settings.ellipsis).addClass("prev-canto");
                pagerRender.appendChild(Kimo.jQuery(ellipsisBtn).get(0));
            }

            for (var i = 0; i < rangeLength; i++) {
                var item = Kimo.jQuery(this.itemRenderer(this.state.range[i]));
                item.data("canto-no", this.state.range[i]);

                if (this.state.range[i] === this.state.selected) {
                    item.addClass(this.settings.selectedCls);
                }

                pagerRender.appendChild(item.get(0));
            }

            if (this.state.currentPage < this.state.maxPage) {
                var ellipsisBtn = Kimo.jQuery("<div/>").text(this.settings.ellipsis).addClass("next-canto");
                pagerRender.appendChild(Kimo.jQuery(ellipsisBtn).get(0));
            }
            this.widget.html(Kimo.jQuery(pagerRender));
        },

        _computePages: function(start) {
            var nextStart = (start * this.settings.itemsOnPage) < this.settings.items ? start * this.settings.itemsOnPage : this.settings.items,
                    start = nextStart - this.settings.itemsOnPage + 1,
                    range = [];
            for (var i = start; i <= nextStart; i++) {
                range.push(i);
            }
            return range;
        },

        render: function(container) {
            if (container) {
                Kimo.jQuery(container).empty().append(this.widget);
            }
            return this.widget;
        }

    });

    return {
        init: function (config) {
            //config.root = "body";
            this.entityView = Kimo.createEntityView("CantoPager", config);
        },

        render: function () {
            return this.entityView.render();
        }
    }


});