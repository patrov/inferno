define(["Kimo/core", "component!inferno:annotation"], function (Kimo, Annotationcomponent) {

    /*
     * Manage note editor
     **/
    var NoteEditorManager = (function () {

        var ANNOTATE_TAB = 'annotation',

            enabled = 1,

            settings = {
                infoSelector : '',
                root: null
            },

        bindEvents = function () {

             Kimo.Observable.registerEvents(["userTabSelection"]);
             Kimo.Observable.on("userTabSelection", function (tabname) {
                if (ANNOTATE_TAB === tabname) {
                    var textContainer = Kimo.jQuery("#main-contrib-zone .it-canto-container").eq(0);
                    Annotationcomponent.apply({textContainer: textContainer, viewPanel: '#annotation-zone'});
                    Kimo.ParamsContainer.set("disableTerzaSelection", true);
                    console.log(Kimo.ParamsContainer.get('disableTerzaSelection'));
                }
                
             });
        },
        
        showAnnotation = function () {
            /* Afficher les annotation ici */
        },
        
        getApi = function () {
            return {};
        },

       configure = function (userSettings) {
         settings = Kimo.jQuery.extend(true, {}, settings, userSettings);
         bindEvents();
         return getApi();
       };

       return {
           configure: configure
       };

    }());

    return NoteEditorManager;
});
