define([], function(){
    var PagerManager = (function(){

    var settings = {
            linkSelector: ".canto-link",
            pageContainer: "#canto-pager",
            selectedCls: "selected"
        },
        canto = [1, 34],
        selectCanto = function (no) {
            $(settings.pageContainer).find(settings.linkSelector).removeClass(settings.selectedClass);
            $("#canto-"+no).addClass(settings.selectedCls);
        }

   return {
       selectCanto: selectCanto
   }

}());
return PagerManager;

});
