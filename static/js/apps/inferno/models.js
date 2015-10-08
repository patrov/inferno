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

        like: function() {
            return $.ajax({ url: '/rest/vote', type: 'POST',   data :{ data: JSON.stringify({'translation': this.getUid() })}});
        },

        unLike: function () {
            //return $.ajax({ url: '/vote/vote', TYPE: 'POST', data: {'translation': translationId }});
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
        },
        getPath: function () {
            return "/rest/comment"
        }
    }),

    /* Vote item */
    VoteItem = Kimo.ModelManager.createEntity({
        name : "Vote",

        defaults: {
            translation: null,
            user: null,
            value: null
        },

        getPath: function () {
            return "/rest/vote";
        }
    }),

    VoteRepository = Kimo.ModelManager.createRepository({
        repositoryName: "VoteRepository",
        model: VoteItem,

        getPath: function () {
            return "/rest/vote";
        }

    }),


    CommentRepository = Kimo.ModelManager.createRepository({
        repositoryName: "CommentRepository",
        model: CommentItem,
        getPath: function () {
            return "/rest/comment"
        },

        getComments: function (translation) {
        var self = this,
            dfd = new $.Deferred();
            $.ajax({url: this.getPath(), data:{'target': translation.uid}}).done(function(response){
                self.setData(response);
               dfd.resolve(self.toJson());
            }).fail(dfd.reject);
            return dfd.promise();
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
                self.setData(response);
                dfd.resolve(self.toJson());
            }).fail(dfd.reject);
            return dfd.promise();
        }

    });

    TranslationRepository = new TranslationRepository;
    CommentRepository = new CommentRepository;
    VoteRepository = new VoteRepository;

    return {
        TranslationItem: TranslationItem,
        CommentItem: CommentItem,
        VoteItem : VoteItem,

        VoteRepository: VoteRepository,
        TranslationRepository: TranslationRepository,
        CommentRepository: CommentRepository
    }
});