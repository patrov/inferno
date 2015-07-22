/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */


define(['jquery', 'text!../time/templates/layout.html'], function (jQuery, layout) {

    /* create a component constructor
     * Handle and trigger events
     * Parse component actions
     * send messages other components that will be handled
     * actions allow us to match
     * content must have an id.
     *  */
    return {
        init: function (config) {
            this.layout = jQuery(layout).clone();
            jQuery(this.layout).attr("id", "qs6d7qs6d4sd");
            jQuery(this.layout).data("id", "qs6d7qs6d4sd");
            jQuery(this.layout).append("<p>" + new Date().getTime() + "</p>");
            this.bindEvents();
        },

        getId: function () {
            return "time";
        },

        bindEvents: function () {
            jQuery('body').on('click', "#qs6d7qs6d4sd", function () {
                console.log("this is the way it should Work");
            });
        },

        render: function () {
            return this.layout;
        }
    }
});