/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
/*require("manager!inferno:viewmode", function(){


});*/

define(["text!bi.templates/partials/commentzone.partial.html"], function (tpl) {

    var ViewModeManager = {

        currentViewMode: 'terza',
        terzaMode: function() {
            /* hide zone 1 */
            if(this.currentViewMode === 'terza') { return; }
            $(".cantoZone").show("fast");
            $(".terzaZone").removeClass("col-sm-4");
            $(".translationZone").removeClass("col-sm-4");
            $(".commentZone").remove("fast");
            this.currentViewMode = 'terza';
        },

        commentMode: function() {
            if(this.currentViewMode === 'comment') { return; }
            $(".col-sm-1").addClass("cantoZone").hide("fast");
            var commentZone = $(tpl).clone();
            $('.commentzone-close-btn', commentZone).on("click", $.proxy(ViewModeManager.terzaMode, ViewModeManager));
           $(commentZone).addClass("commentZone col-sm-4");
           $(".col-sm-6").addClass("terzaZone col-sm-4");
           $(".col-sm-5").addClass("translationZone col-sm-4");
           $(".row").append(commentZone);
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

