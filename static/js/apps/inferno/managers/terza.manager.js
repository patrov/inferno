define(["Kimo/core", "jquery", "vendor.mustache"], function (Kimo, $, Mustache) {

    var terzaManager = (function () {
        this.stzAction = $("<p class='stz-actions'><a class='lang-choice' data-lang='it' href='javascript:;'>Dante</a> | <a class='lang-choice' data-lang='en' href='javascript:;'>Eng</a> | <a class='lang-choice' data-lang='fr' href='javascript:;'>Fr</a></p>").clone();
        this.currentTerza = null;
        this.currentCanto = null;
        this.previousContent = null;
        this.currentLang = 'it';
        this.isConfigured = false;

        this.configure = function (config) {
            var self = this,
            target,
            lang;
            if (this.isConfigured) {
                return;
            }
            $(config.root).on("click", ".lang-choice", function (e) {
                e.stopPropagation();
                e.preventDefault();
                target = e.currentTarget,
                lang = $(target).data("lang");
                $(self.stzAction).find(".lang-choice").removeClass("selected");
                $(target).addClass("selected");
                self.showTranslationBoard(lang);
                return false;
            });

            $(config.root).on("click", ".stz", function (e) {
                var stz = e.currentTarget,
                no = $(stz).data("no");
                self.selectTerza(no);
            });

            /*$(config.root).on("mouseleave", ".current-traduction", function (e) {
                var target = e.currentTarget;
                $(target).html(self.previousContent);
                $(self.currentTerza).removeClass("selected");
                self.currentTerza = null;
                self.previousContent = null;
            });*/
            this.isConfigured = true;
        },

        this.selectTerza = function (terzaNo, silent) {
            var terzaNode = $(".no-" + terzaNo, $("." + this.currentLang + "-canto-container").eq(0)),
            triggerEvent = silent || true,
            clonedNode;
            if(!terzaNode) {
                return;
            }
            this.showStanzaInfos(terzaNode);
            this.currentTerzaNo = terzaNo;
            $(".stz").removeClass("selected");
            clonedNode = $(terzaNode).clone(true);
            $(terzaNode).addClass("selected");
            if (triggerEvent) {
                Kimo.Observable.trigger("TerzaSelection", $(clonedNode), this.currentTerzaNo, terzaNode);
            }
            this.showLanguages($(clonedNode));
        },


        this.showTranslationBoard = function (lang) {
            var self = this;
            var selectedLang = lang || 'it';
            var terza = $(".no-" + this.currentTerzaNo, $("." + selectedLang + "-canto-container").eq(0));
            if(!terza.length) {
                this.loadTerza(this.currentTerzaNo, selectedLang).done(function (response) {
                    var tpl = "<p style='position:relative'>{{content}}</p>",
                    render = Mustache.render(tpl, response),
                    translationCtn = $("#translation").find(".current-translation").eq(0);
                    $(translationCtn).html($(render));
                    self.showLanguages();
                });
            } else {
                var tpl = $("</p>").html($(terza).html());
                $("#translation").find(".current-translation").html($(tpl));
                self.showLanguages();
            }
        },

        this.selectTerzaByPosition = function (position) {
            var terzaNode = $(".stz:nth-child("+position+")", $("." + this.currentLang + "-canto-container").eq(0)),
                no;
            if(!terzaNode) { return; };
            no = $(terzaNode).data('no');
            this.selectTerza(no);
        },


        this.loadCantoTranslation = function (lang) {
            var self = this;
            this.currentLang = lang;
            Kimo.ParamsContainer.set("currentLang", this.currentLang);
            $.ajax({
                url: "/rest/canto/"+this.currentCanto,
                data: {
                    lang: this.currentLang
                }
            }).done(function (response) {
                self.populateStanzas(response, lang);
                Kimo.Observable.trigger("CantoTranslationLoaded", lang, response);
            });
        },

        this.loadTerza = function (terzaNo, lang) {
            lang = lang || 'it';
            return $.ajax({
                url: "/rest/terza/"+terzaNo,
                data: {
                    lang: lang
                }
            });
        },


        this.loadTranslations = function (terza) {
			if (!terza) {
				throw 'TerzaCantBeFound';
			}
            return $.ajax({
                url: "/rest/translation",
                data : {
                    terza : terza
                }
            });
        },

        this.loadCanto = function (noCanto) {
            var self = this,
            noCanto = noCanto || 1,
            restParams = {
                url: "/rest/canto/"+noCanto
                };
            if (this.currentLang !== 'it' ) {
                restParams.data = {
                    lang: this.currentLang
                    };
            }

            this.currentCanto = noCanto;
            $.ajax(restParams).done(function (response) {
                self.populateStanzas(response, self.currentLang);
                Kimo.Observable.trigger("CantoLoaded", noCanto, response);
            });
        },

        this.showStanzaInfos = function (terzaNode) {
            $("#terza-infos").remove();
            var infoTpl = $("<span/>"),
                terzaNo = $(terzaNode).data("pos");
                $(infoTpl).addClass("pull-right");
            $(infoTpl).attr("id","terza-infos").html("canto <strong>" + this.currentCanto + "</strong> - Terza <strong>" + terzaNo + "</strong>");
            terzaNode.append(infoTpl);
        },

		
		/* Populate terza translation */
		this.populateTranslation = function (stanzas, lang) {
			var max = $(".it-canto-container").find(".terza-item").length,
				ctn = $("." + lang + "-canto-container"),
				emptyTerza = "<div>Propoze yon tradiksyon.</div>";
				$(emptyTerza).addClass("row terza-item empty");
				$(ctn).empty();
				tpl = '<div class="row terza-item"><span class="col-xs-1 terza-no">{{terzaPos}}</span><p class=" col-xs-11 stz no-{{no_terza}}" data-pos="{{terzaPos}}" data-no="{{no_terza}}">{{content}}</p></div>';
				
				
				
		},
		
        this.populateStanzas = function (stanzas, lang) {
            lang = lang || 'it';
            var tpl,
				emptyTpl,
				max = $(".it-canto-container").find(".terza-item").length,
				render,
				config,
				domFragment;
				ctn = $("." + lang + "-canto-container");
				
            $(ctn).empty();
            tpl = '<div class="row terza-item"><span class="col-xs-1 terza-no">{{terzaPos}}</span><p class=" col-xs-11 stz no-{{no_terza}}" data-pos="{{terzaPos}}" data-no="{{no_terza}}">{{content}}</p></div>',
			emptyTpl = '<div class="row terza-item"><span class="col-xs-1 terza-no">{{terzaPos}}</span><p class=" col-xs-11 stz no-{{no_terza}}" data-pos="{{terzaPos}}" data-no="{{no_terza}}"><strong>{{content}}</strong></p></div>';

			if (lang !== "kr") {
				max = stanzas.length; 
			}
			domFragment = document.createDocumentFragment();
			
			for(var i = 0; i < max; i++) {
				terzaItem = stanzas[i];
				 if (terzaItem ) {
					terzaItem.terzaPos = i + 1;
					render = Mustache.render(tpl, terzaItem);
				} else {
					var config = Kimo.ParamsContainer.get("config");
					content = "Ou poko propoze yon vèsyon.";
					if (config.mode ==="view") {
						content = "Poko gen tradiksyon."
					}
					
					terzaItem = {content: content , terzaPos: i + 1}
					render = Mustache.render(emptyTpl, terzaItem);
					$(render).addClass("empty");
				}
				domFragment.appendChild($(render).get(0));				
			}
			
			$(ctn).append($(domFragment));
        }
		
        this.showTradContext = function () {
            $('#user-action-tab a[href="#translation"]').tab('show');
        }

        this.getCurrentTerza = function () {
            return this.currentTerzaNo;
        }

        this.getFocusedTerza = function () {
            return $("#editing-zone").find(".current-translation").eq(0);
        }

        this.showLanguages = function () {
             var focusedTerza = this.getFocusedTerza();
            var actions = $(this.stzAction).clone();
            $(focusedTerza).css({
                "position": "relative"
            });
            $(actions).css({
                "position": "absolute"
            });
            $(focusedTerza).append(actions);
        }

        var self = this;
        return {
            configure: $.proxy(this.configure, this),
            showLanguages: $.proxy(this.showLanguages, this),
            getCurrentTerza: $.proxy(this.getCurrentTerza, this),
            getCurrentCanto: function (){
                return self.currentCanto;
            },
            selectTerza: $.proxy(this.selectTerza, this),
            selectTerzaByPosition: $.proxy(this.selectTerzaByPosition, this),
            loadCanto: $.proxy(this.loadCanto, this),
            loadCantoTranslation: $.proxy(this.loadCantoTranslation, this)
        };

    }());
    return terzaManager;
});