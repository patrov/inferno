define(["Kimo/core"], function(Kimo) {


    var TranslationItem = Kimo.ModelManager.createEntity({
        name: "Translation",
        defaults: {
            content: "",
            id: 0,
            terza: "",
            canto: "",
            pubdate: "",
            update_date: "",
            vote: 0,
            state: 0 //default draft
        },
        init: function() {
            if (this.getPubdate() === "") {
                this.set("pubdate", new Date());   
            }
        },
        
        isEmpty: function() {
            return (!this.get("content")) ? true : false;
        },
        getPath: function() {
            return "/rest/translation"
        },
        like: function() {
            return $.ajax({url: this.getPath() + '/vote/' + this.getUid() + '/up', type: 'POST'});
        },
        disLike: function() {
            return $.ajax({url: this.getPath() + '/vote/' + this.getUid() + '/down', type: 'POST'});
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
        getPath: function() {
            return "/rest/comment"
        }
    }),
    /* Vote item */
    VoteItem = Kimo.ModelManager.createEntity({
        name: "Vote",
        defaults: {
            translation: null,
            user: null,
            value: null
        },
        getPath: function() {
            return "/rest/vote";
        }
    }),
    VoteRepository = Kimo.ModelManager.createRepository({
        repositoryName: "VoteRepository",
        model: VoteItem,
        getPath: function() {
            return "/rest/vote";
        }

    }),
    CommentRepository = Kimo.ModelManager.createRepository({
        repositoryName: "CommentRepository",
        model: CommentItem,
        getPath: function() {
            return "/rest/comment"
        },
        getComments: function(translation) {
            var self = this,
                    dfd = new $.Deferred();
            $.ajax({url: this.getPath(), data: {'target': translation.uid}}).done(function(response) {
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
        VoteItem: VoteItem,
        VoteRepository: VoteRepository,
        TranslationRepository: TranslationRepository,
        CommentRepository: CommentRepository
    }
});