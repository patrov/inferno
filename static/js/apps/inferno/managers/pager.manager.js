define(["Kimo/core", "bi.components/cantopager/main"], function(Kimo) {

    var PagerManager = (function() {

        var settings = {
            linkSelector: ".canto-link",
            pageContainer: "#canto-pager",
            selectedCls: "selected"
        },
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
        }
        ,
                pagerInstance = null,
                selectCanto = function(no) {
            pagerInstance.selectCanto(no);
        },
                showPager = function(container) {
            pagerInstance.render(container);
        },
                configure = function(settings) {
            try {
                pagerInstance = Kimo.createEntityView("CantoPager", {
                    root: settings.root,
                    settings: {
                        itemRenderer: function(page) {
                            return Kimo.jQuery("<div/>").text("Chan " + toRoman(page)).addClass("canto-link");
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
                getPager: function() {
                    return pagerInstance;
                }
            }
        }
        return {configure: configure};
    }());
    return PagerManager;

});
