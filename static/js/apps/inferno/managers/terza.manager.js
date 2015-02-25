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
            if (this.isConfigured) { return; }
            $(config.root).on("click", ".lang-choice", function (e) {
                e.stopPropagation();
                e.preventDefault();
                target = e.currentTarget,
                lang = $(target).data("lang");
                self.showTranslationBoard(lang);
                return false;
            });

            $(config.root).on("click", ".stz", function (e) {
                var stz = e.currentTarget;
                self.currentTerzaNo = $(stz).data("no");
                $(".stz").removeClass("selected");
                $(stz).addClass("selected");
                var position = $(stz).position();
                var top = position.top - 20;
                //$("#user-context").animate({top: top+"px"},"faste");
                stz = $(stz).clone(true).addClass("current-translation").removeClass("selected");
                //self.loadTranslations(self.currentTerzaNo);
                Kimo.Observable.trigger("TerzaSelection", $(stz), self.currentTerzaNo);
            });

            $(config.root).on("mouseleave", ".current-traduction", function (e) {
                var target = e.currentTarget;
                $(target).html(self.previousContent);
                $(self.currentTerza).removeClass("selected");
                self.currentTerza = null;
                self.previousContent = null;
            });
            this.isConfigured = true;
        },

        /* load canto translation
			show loading
			populate canto
		*/


        this.showTranslationBoard = function (lang) {
            var selectedLang = lang || 'it';
            var terza = $(".no-" + this.currentTerzaNo, $("." + selectedLang + "-canto-container").eq(0));
            if(!terza.length) {
             this.loadTerza(this.currentTerzaNo, selectedLang).done(function (response) {
                 var tpl = "<p style='position:relative'>{{content}}</p>",
                 render = Mustache.render(tpl, response);
                 $("#translation").find(".current-translation").html($(render));
             });
            } else {
                var tpl = $("</p>").html($(terza).html());
                $("#translation").find(".current-translation").html($(tpl));
            }
        }


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
        });
    },

    this.loadTerza = function (terzaNo, lang) {
       lang = lang || 'it';
       return $.ajax({
           url: "/rest/terza/"+terzaNo,
           data: {lang: lang}
       });
    },


    this.loadTranslations = function (terza) {
        return $.ajax({
            url: "/rest/translation",
            data : {
                terza : terza,
                user: 'harris'
            }
        });
    },

    this.loadCanto = function (noCanto) {
        var self = this,
        noCanto = noCanto || 1,
        restParams = {url: "/rest/canto/"+noCanto};
        if (this.currentLang !=='it' ) {
            restParams.data = {lang:this.currentLang};
        }
        this.currentCanto = noCanto;
        $.ajax(restParams).done(function(response){
            self.populateStanzas(response);
            Kimo.Observable.trigger("cantoLoaded", noCanto, response);
        });
    },

    this.populateStanzas = function (stanzas, lang) {
        lang = lang || 'it';
        var tpl,
            render,
            ctn = $("."+lang+"-canto-container");
        $(ctn).empty();
        tpl = '<p class="stz no-{{no_terza}}" data-no="{{no_terza}}">{{content}}</p>';
        $.each(stanzas, function (i) {
            render = Mustache.render(tpl, stanzas[i]);
            $(ctn).append(render);
        });

    }
    this.showTradContext = function () {
        $('#user-action-tab a[href="#translation"]').tab('show');
    }

    this.getCurrentTerza = function () {
        return this.currentTerzaNo;
    }

    this.showLanguages = function (terza) {
        // if (this.currentterza && (this.currentterza.get(0) == terza)) return;
        this.currentTerza = $(terza);
        this.previousContent = $(terza).clone().html();
        var actions = $(this.stzAction).clone();
        // $(terza).addClass("selected");
        $(terza).css({
            position: "relative"
        });
        $(actions).css({
            position: "absolute"
        });
        $(terza).append(actions);
    }
    this.unselect = function () {

    }

    return {
        configure: $.proxy(this.configure, this),
        showLanguages: $.proxy(this.showLanguages, this),
        getCurrentTerza: $.proxy(this.getCurrentTerza, this),
        loadCanto: $.proxy(this.loadCanto, this),
        loadCantoTranslation: $.proxy(this.loadCantoTranslation, this)
    };

}());
    return terzaManager;
});