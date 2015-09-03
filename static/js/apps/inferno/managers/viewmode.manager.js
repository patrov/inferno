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
            if (this.currentViewMode === 'terza') { return; }
            $(".cantoZone").show("fast");
            $(".comment-zone-wrapper").remove();
            $(".terzaZone").addClass("col-sm-6").removeClass("col-sm-4");
            this.resizeHeader();
            $(".translationZone").addClass("col-sm-5").removeClass("col-sm-4");
            $(".user-context-wrapper").eq(0).animate({"width":  $(".user-context-wrapper").eq(0).parent().width()});
            this.currentViewMode = 'terza';
        },

        commentMode: function() {
           if (this.currentViewMode === 'comment') { return; }
           /*hide pager*/
           $(".col-sm-1").addClass("cantoZone").hide("fast");
           
           /*comment-zone*/
           var commentZoneWrapper = $(tpl).clone(),
                commentZone = commentZoneWrapper.find(".comment-zone").eq(0);
           $('.commentzone-close-btn', commentZoneWrapper).on("click", $.proxy(ViewModeManager.terzaMode, ViewModeManager));
           
           $(commentZoneWrapper).addClass("col-sm-4");
           $(".col-sm-6").removeClass("col-sm-6").addClass("terzaZone col-sm-4");
           this.resizeHeader();
           $(".col-sm-5").removeClass("col-sm-5").addClass("translationZone col-sm-4");
           $(".user-context-wrapper").eq(0).css({"width": $(".user-context-wrapper").eq(0).parent().width()});
           
           $("#main-contrib-zone").append(commentZoneWrapper);
           commentZone.css({"width": commentZoneWrapper.width()});
           this.currentViewMode = 'comment';
        },
        
        resizeHeader: function (mode) {
            $(".available-lang").css("width", $(".available-lang").parent().width()); 
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

