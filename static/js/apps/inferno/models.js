define(["Kimo/core"], function(Kimo) {


    var TranslationItem = Kimo.ModelManager.createEntity({
        name: "Translation",
        defaults: {
            content: "",
            terza: "",
            canto: "",
            pub_date: "",
            update_date: "",
            vote: 0,
            state: 0 //default draft
        },
        init: function() {

        },
        isEmpty: function() {
            return (!this.get("content")) ? true : false;
        },
        getPath: function() {
            return "/rest/translation"
        },
        checkData: function() {
            return false;
        }
    }),
    /* Comment Item */
    CommentItem = Kimo.ModelManager.createEntity({
        name: "Comment",
        defaults: {
            content: '',
            target: null
        } 
    }),
    
    CommentRepository = Kimo.ModelManager.createRepository({
        repositoryName: "CommentRepository",
        model: CommentItem,
        getPath: function () {
            return "/rest/comment"
        },
                
        getComments: function (terza) {
            
        }
        
    }),
   
    TranslationRepository = Kimo.ModelManager.createRepository({
        repositoryName: "TranslationRepository",
        model: TranslationItem,
        getPath: function() {
            return "/rest/translation"
        },
                
        getContributions: function(terza) {
            var self = this,
                    dfd = new $.Deferred();
            terza = terza || 1;
            $.ajax({
                url: this.getPath(),
                data: {terza: terza, type: 'contrib'}
            }).done(function(response) {
                var data = self.setData(response);
                dfd.resolve(self.toJson());
            }).fail(dfd.reject);
            return dfd.promise();
        }

    });

    TranslationRepository = new TranslationRepository;

    return {
        TranslationItem: TranslationItem,
        //terzaItem : terzaItem,
        TranslationRepository: TranslationRepository,
        CommentItem: CommentItem,
        CommentRepository: CommentRepository
        
    }
});