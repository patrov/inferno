define(["Kimo/core", "component!noteeditor"], function (Kimo) {

    /*
     * Manage note editor
     **/
    var NoteEditorManager = (function () {

        var EDITING_TAB = 'editing',

            enabled = 1,

            settings = {
                infoSelector : '',
                root: null
            },

        bindEvents = function () {

             Kimo.Observable.registerEvents(["userTabSelection"]);
             Kimo.Observable.on("userTabSelection", function (tabname) {
                 if (EDITING_TAB === tabname) {
                     
                 }

             });

        },

        getApi = function () {
            return {};
        },

       configure = function (userSettings) {
         settings = Kimo.jQuery.extend(true, {}, settings, userSettings);
         bindEvents();
         return getApi();
       }

       return {
           configure: configure
       };

    }());

    return NoteEditorManager;
});
