define(["Kimo/core"], function(Kimo){


    var TranslationItem = Kimo.ModelManager.createEntity({
        name: "Translation",
        defaults: {
            content: "",
            terza: "",
            canto: "",
            pub_date: "",
            update_date:"",
            vote: "",
            state: 0 //default draft
        },

        init: function(){

        },

        getPath: function(){
            return "/rest/translation"
        },

        checkData: function(){
            return false;
        }
    }),



    TranslationRepository = Kimo.ModelManager.createRepository({
        repositoryName: "TranslationRepository",
        model: TranslationItem,
        getPath: function () {
            return "/rest/translation"
        }
    });

    TranslationRepository = new TranslationRepository;

    return {
        TranslationItem : TranslationItem,
        //terzaItem : terzaItem,
        TranslationRepository : TranslationRepository
    }
});