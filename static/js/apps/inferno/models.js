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

    /* exp:vote:metadata */
    AlertMetadata = Kimo.ModelManager.createEntity({
        name: "Metadata",
        defaults: {
            "key":"alert",
            "value": 1,
            "target":""
        }
    }),

    AlertMetadataRepository = Kimo.ModelManager.createRepository({
        repositoryName: 'AlertMetadataRepository',
        model: AlertMetadata,
        getPath: function () {
            return "/rest/alert"
        },

        doAlert: function (dataType, targetId, data) {
            if (!targetId) { throw "An id must be provided"; }
            if (!dataType) { throw "a dataType must be provided"; }

            var url = this.getPath() + "/" + dataType + "/" + targetId;
            return $.ajax({ url: url, type: "POST", data: {data: JSON.stringify({"key":"alert", "value":1})} });
        },

        countAlert: function (dataType, targetId) {
            if (!targetId) { throw "An id must be provided"; }
            if (!dataType) { throw "a dataType must be provided"; }
            var url = this.getPath() + "/" + dataType + "/" + targetId; 
            return $.ajax({url: url}); 
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
        },

        getUserTranslation: function (terza) {
            if (!terza) { return; }
            var self = this,
                dfd = new $.Deferred();

            $.ajax({ 
                url: this.getPath() + "/currentuser",
                data: {terza: terza}
                }).done(function (response) {
                    dfd.resolve(response);
                }).fail(dfd.reject);

            return dfd.promise();
        }
    });

    AnnotationRepository = Kimo.ModelManager.createRepository({
        repositoryName : 'AnnotationRepository',
        model: Kimo.ModelManager.createEntity({
            name: 'Annotations',
            default:{
                terza: null
            }
        }),
        
        getPath : function () {
            '/rest/annotations'
        },

        setPosition: function (annotation) {
            if (!annotation.terza) {
                throw new Error('AnnotationRepository: terza can\'t be null');
            }
            
            if (!Array.isArray(annotation.position)) {
                throw new Error('AnnotationRepository: terza can\'t be null');
            }

            var self = this;
            return Kimo.jQuery.ajax({
                type: 'POST',
                url: '/rest/annotations/position/' + annotation.terza,
                data: JSON.stringify(annotation),
                contentType: "application/json",
            }).done(function (response) {
                self.setData(response);
            });
        }

    });

    TranslRepository = new TranslationRepository;
    CommentRepository = new CommentRepository;
    VoteRepository = new VoteRepository;
    AnnotationRepository = new AnnotationRepository;    
    AlertMetadataRepository = new AlertMetadataRepository;

    return {
        TranslationItem: TranslationItem,
        CommentItem: CommentItem,
        VoteItem: VoteItem,
        VoteRepository: VoteRepository,
        TranslationRepository: TranslRepository,
        CommentRepository: CommentRepository,
        AlertMetadataRepository: AlertMetadataRepository,
        AnnotationRepository: AnnotationRepository,
        createTranslationRepository: function (instanceConfig) {
            return new TranslationRepository(instanceConfig);
        }
    }
});