/*
 *Allow us to add note to a terza
 * 1. First we select the terza
 * 2. Then we add the content
 * 3. Then we save the content to the db
 *
 **/

define(['vendor.annotator'], function(annotator) {


    /* extend annotator here */
    var createInlineNotePlugins = function(Annotator) {

        Annotator.Plugin.TerzaEditor = function(element, option) {
            this.options = {}; 
            Kimo.jQuery.extend(this.options, option);
        }
        
        /* terza editor */
        jQuery.extend(Annotator.Plugin.TerzaEditor.prototype, new Annotator.Plugin(), {
            pluginInit: function() {
                this.store = [];
                this.itemRenderer = jQuery('<div><p class="annotation-content"></p></div>').clone();
                this.annotationViewerPanel = jQuery(this.options.viewPanel);
              
                this.bindEvents();
            },
            getAnnotationById: function(key) {
                var item = null, self = this;
                jQuery.each(this.store, function(i) {
                    if (self.store[i].id === key) {
                        item = self.store;
                        return true;
                    }
                    return item;
                });
            },
            bindEvents: function() {
                var self = this;

                this.annotator.subscribe('annotationEditorShown', function(editor) {
                    /* change editor here */
                    console.log(editor);
                });

                this.annotator.subscribe('annotationCreated', this.handleNewAnnotation.bind(this));

                this.annotationViewerPanel.on("click", '.annotation-content', this.handle);
            },
            updateView: function() {
                var store = this.annotator.plugins.Store.annotations, self = this,
                        annotationViewPanel = this.annotationViewerPanel,
                        annotationItem = this.itemRenderer, item;


                annotationViewPanel.empty();
                jQuery.each(store, function(no) {
                    item = store[no];
                    annotationItem = jQuery(annotationItem).clone();
                    jQuery(annotationItem).find('.annotation-content').html(item.text);
                    annotationViewPanel.append(annotationItem);

                    jQuery(annotationItem).data('annotation-item', item);
                    annotationItem.on('mouseenter', self.handleAnnotationMouseOver.bind(self));
                    annotationItem.on('mouseleave', self.handleMouseLeave.bind(self));
                });
            },
            buildBadge: function(badgeInfos) {
                var badgeNo = jQuery(badgeInfos).data('badge-no'),
                        badge = jQuery('<i/>').addClass(" badge annotation-no").html(badgeNo);
                badge.data("annotation", jQuery(badgeInfos).data('annotation'));
                if (!badgeNo) {
                    return false;
                }
                jQuery(badgeInfos).replaceWith(badge);
            },
            handleMouseLeave: function(e) {
                var annotation = jQuery(e.currentTarget).data("annotation-item"),
                        badgeInfos = jQuery('.badge-infos'),
                        self = this;

                if (!annotation) {
                    return false;
                }
                if (!annotation.highlights.length) {
                    return false;
                }

                jQuery(annotation.highlights).map(function() {
                    jQuery(this).contents().unwrap();
                });

                /* show badges */
                jQuery('.badge-hl').removeClass('badge-hl');
            },
            showAnnotationsOptions: function() {
                /* Ajouter fonction éditer et effacer ici ! */
            },
            handleAnnotationMouseOver: function(e) {
                var annotation = jQuery(e.currentTarget).data('annotation-item'),
                        annotationBefore = 0;
                if (!annotation) {
                    return false;
                }
                /* hide button and show them */
                jQuery(annotation.highlights).map(function() {
                    jQuery(this).css({border: '1px solid blue'});
                });

                /* normalize before setup */
                t = this.annotator.setupAnnotation(annotation);
                jQuery(t.highlights).map(function() {
                    var parent = jQuery(this).parent();
                    if (parent.hasClass('annotation-no')) {
                        var badgeInfos = jQuery('<i/>').addClass('badge-infos');
                        badgeInfos.data("annotation", jQuery(parent).data("annotation"));
                        badgeInfos.data("badge-no", jQuery(parent).data("annotation").position);
                        //jQuery(parent).replaceWith(badgeInfos);
                        parent.addClass("badge-hl");
                    }
                });
            },
            getNumber: (function() {
                var cpt = 0;
                return function() {
                    cpt = cpt + 1;
                    return cpt;
                };
            }()),
            showSelection: function(annotation) {
                this.annotator.highlightRange(annotation.ranges, 'rdacial_sd');
            },
            updateAnnotationPosition: function() {
                /* find all badge */
                var badges = jQuery('.annotation-no');
                badges.map(function(i) {
                    jQuery(this).html(i + 1);
                    annotation = jQuery(this).data('annotation');
                    annotation.position = i + 1;
                });

            },
            handleNewAnnotation: function(annotation) {
                /* When a new annotation is created
                 * associate a provis number then update all the numbers.
                 * */
                var noBadge = jQuery('<span>-</span>').clone(),
                        nb,
                        nbHl = annotation.highlights.length;
                noBadge.addClass('badge');

                jQuery.each(annotation.highlights, function(i) {

                    nb = i + 1;
                    if (nb === nbHl) { //last item
                        jQuery(noBadge).addClass('annotation-no');
                        jQuery(annotation.highlights[i]).append(noBadge);
                        jQuery(annotation.highlights[i]).contents().unwrap();
                        jQuery(noBadge).data('annotation', annotation);
                    } else {
                        jQuery(annotation.highlights[i]).contents().unwrap();
                    }
                });

                annotation.highlights = [];
                this.updateAnnotationPosition();
                this.updateView();
            }
        });
    };
    
    createInlineNotePlugins(annotator);
    
    return {
        /* notes appear when we scroll */
        apply: function(config) {
            if (typeof $.fn.annotator !== 'function') {
                throw new Error('AnnotatorComponentException: Annotator is not loaded!');
            }
            if (!$(config.textContainer).length) {
                throw new Error('AnnotatorComponentException: textContainer couldn\'t be found');
            }

            $(config.textContainer).annotator({
                readOnly: false,
                viewPanelId: "#radical",
            })
            .annotator('addPlugin', 'Store')
            .annotator('addPlugin', 'TerzaEditor', {viewPanel: config.viewPanel});
            
            $(config.textContainer).data('annotator');
        },
        disable: function() {
        },
        loadAnnotation: function() {
        }
    };

});