define(["Kimo/core", "bi.components/cantopager/main"], function(Kimo) {

    var PagerManager = (function() {

        var settings = {
            linkSelector: ".canto-link",
            pageContainer: "#canto-pager",
            selectedCls: "selected"
        },
        canto = [1, 34],
                selectCanto = function(no) {
            $(settings.pageContainer).find(settings.linkSelector).removeClass(settings.selectedClass);
            $("#canto-" + no).addClass(settings.selectedCls);
        },
                showPager = function(container) {
            try {
                this.cantoPager = Kimo.createEntityView("CantoPager", {
                    settings: {
                        itemRenderer: function(page) {
                            return Kimo.jQuery("<div/>").text(page).addClass("canto-link");
                        }
                    }

                });
                this.cantoPager.render(container);
            } catch (e) {
                console.log(e);
            }
        };


        return {
            selectCanto: selectCanto,
            showCantoPager: showPager
        };

    }());
    return PagerManager;

});
