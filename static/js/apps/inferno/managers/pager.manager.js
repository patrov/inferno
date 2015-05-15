define(["Kimo/core", "bi.components/cantopager/main"], function(Kimo) {

    var PagerManager = (function() {

        var settings = {
            linkSelector: ".canto-link",
            pageContainer: "#canto-pager",
            selectedCls: "selected"
        },
        
        pagerInstance = null,
        
        selectCanto = function(no) {
            pagerInstance.selectCanto(no);
        },

        showPager = function(container) {
            pagerInstance.render(container);
        },

        configure = function (settings) {
            try {
                pagerInstance = Kimo.createEntityView("CantoPager", {
                    root: settings.root,
                    settings: {
                        itemRenderer: function(page) {
                            return Kimo.jQuery("<div/>").text(page).addClass("canto-link");
                        }
                    }
                });

                return getApi();
            } catch (e) {
                console.log(e);
            }
        },

        getApi = function () {
            return {
                selectCanto: selectCanto,
                showCantoPager: showPager,
                getPager: function() {
                    return pagerInstance;
                }
            }
        }
        return { configure: configure };
    }());
    return PagerManager;

});
