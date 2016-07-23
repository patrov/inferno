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
		
		itemRenderer = function (position, item) {
			return "<p class='annotation'>["+ position + "] - " + item.text + " </p>";
		},
        
        bindEvents = function () {
            return;
             Kimo.Observable.registerEvents(["userTabSelection",'TerzaSelection']);

             Kimo.Observable.on("userTabSelection", function (tabname) {
                if (ANNOTATE_TAB === tabname) {
                    var textContainer = Kimo.jQuery("#main-contrib-zone .it-canto-container").eq(0);
                    Annotationcomponent.apply({
                        textContainer: textContainer, 
                        viewPanel: '#annotation-zone', 
						itemRenderer: itemRenderer,
                        onCreate: function (annotation) {
                            annotation.terza = Kimo.ParamsContainer.get("currentTerza");    
                    }});
                }
             });

             Kimo.Observable.on("TerzaSelection", function (html, id) {
                Annotationcomponent.loadAnnotation(id);
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
