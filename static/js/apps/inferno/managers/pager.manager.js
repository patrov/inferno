define(["Kimo/core", "bi.components/cantopager/main"], function(Kimo) {

    var PagerManager = (function() {

        var settings = {
            linkSelector: ".canto-link",
            pageContainer: "#canto-pager",
            selectedCls: "selected"
        },

        pagerInstance = null,

        cantoMapping = {
            1: "I",
            5: "V",
            10: "X"
        },
        toRoman = function(number) {

            var ten = Math.floor(number / 10);
            var units = number % 10;
            var roman = "";
            for (var i = 0; i < ten; i++) {
                roman = roman + "X";
            }
            if (units >= 5 && units < 9) {
                var roman = roman + "V";
                var rem = units - 5;
                for (var i = 0; i < rem; i++) {
                    roman = roman + "I";
                }
            }
            else if (units == 4) {
                roman = roman + "IV";

            }

            else if (units == 9) {
                roman = roman + "IX";
            }
            else {
                for (var i = 0; i < units; i++) {
                    roman = roman + "I";
                }
            }
            return roman;
        },

        selectCanto = function(no) {
            pagerInstance.selectCanto(no);
        },

        showPager = function(container) {
            pagerInstance.render(container);
        },

        computeDisabledCanto = function (range) {
            return pagerInstance.disabledRange;
        },

        configure = function(settings) {
            try {

                var disabledRange = [];
                console.log(settings);
                if (settings.viewMode === "contrib") {
                    disabledRange.push(parseInt(Kimo.ParamsContainer.get("translated")) + 1);
                    disabledRange.push("max");
                }
                console.log(disabledRange);
                pagerInstance = Kimo.createEntityView("CantoPager", {
                    root: settings.root,
                    settings: {
                        disabledRange: disabledRange,
                        itemRenderer: function(page) {
                            return Kimo.jQuery("<div/>").html("Chan<br /> " + toRoman(page)).addClass("canto-link");
                        }
                    }
                });

                return getApi();
            } catch (e) {
                console.log(e);
            }
        },

        getApi = function() {
            return {
                selectCanto: selectCanto,
                showCantoPager: showPager,
                getDisabledCanto: computeDisabledCanto,
                getPager: function() {
                    return pagerInstance;
                }
            }
        }
        return {
            configure: configure
        };
    }());

    return PagerManager;

});
