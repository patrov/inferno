/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
/*require("manager!inferno:viewmode", function(){
    
    
});*/

define([], function() {
    
    var ViewModeManager = {
        
        currentViewMode: 'terza',
        terzaMode: function() {
            /* hide zone 1 */
            $(".cantoZone").show("fast");
            $(".terzaZone").removeClass("col-sm-4");
            $(".translationZone").removeClass("col-sm-4");
            $(".commentZone").remove("fast");
            this.currentViewMode = 'terza';
        },
                
        commentMode: function() {
            $(".col-sm-1").addClass("cantoZone").hide("fast");
            var commentZone = $("<div/>"),
                closeBtn = $("<span><i class='fa fa-close pull-right'></i></span>")
           commentZone.append(closeBtn);
           $(closeBtn).find('.fa-close').on('click', $.proxy(ViewModeManager.terzaMode, ViewModeManager));
            $(commentZone).css("border", "1px solid blue");
            $(commentZone).css("paddingTop", "10px")
            $(commentZone).addClass("commentZone col-sm-4");
            $(".col-sm-6").addClass("terzaZone col-sm-4");
            $(".col-sm-5").addClass("translationZone col-sm-4");
            $(".row").append(commentZone);
            commentZone.css("top", "50px");
            this.currentViewMode = 'comment'; 
        }
    };

    return {
        switchViewMode: function(name) {
            ViewModeManager[name+"Mode"]();
        },
        getCurrentMode: function () {
            return ViewModeManager.currentViewMode;
        }
    };


});

