define(["Kimo/core", "jquery", "vendor.mustache"], function (Kimo, $, Mustache) {
    
    var terzaManager = (function () {
        this.stzAction = $("<p class='stz-actions'><a class='lang-choice' data-lang='eng' href='javascript:;'>Eng</a> | <a class='lang-choice' data-lang='fr' href='javascript:;'>Fr</a> | <a class='lang-choice' data-lang='esp' href='javascript:;'>Esp</a></p>").clone();
        this.currentTerza = null;
        this.currentCanto = null;
        this.previousContent = null;
		
		
        this.configure = function (config) {
            var self = this,
            target,
            lang;
				
            $(config.root).on("click", ".lang-choice", function (e) {
                e.stopPropagation();
                e.preventDefault();
                target = e.currentTarget,
                lang = $(target).data("lang");
                this.showTranslationBoard(lang);
                this.loadCantoTranslation(lang);
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
                self.loadTranslations(self.currentTerzaNo);
                Kimo.Observable.trigger("TerzaSelection", $(stz), self.currentTerzaNo);  
            });
            
            
            $(config.root).on("mouseleave", ".current-traduction", function (e) {
                var target = e.currentTarget;
                $(target).html(self.previousContent);
                $(self.currentTerza).removeClass("selected");
                self.currentTerza = null;
                self.previousContent = null;
            });
        },
		
        /* load canto translation
			show loading
			populate canto
		*/
		
		
        this.showTranslationBoard = function (lang) {
            var selectedLang = lang || 'it';
            translation = $("." + selectedLang + "-canto-container").find(".no-" + self.currentTerzaNo).eq(0).html(); //wrong use handle annotation
            $("#translation").find(".current-translation").html(translation);
        }
		
		
        this.loadCantoTranslation = function (lang) {
            $.ajax({
                url: "/rest/canto/"+this.currentCanto, 
                data: {
                    lang:lang
                }
            }).done(function (response) {
            self.populateStanzas(response, lang);
        });
			
    },
        
    this.loadTranslations = function (terza) {
        $.ajax({
            url: "/rest/translation", 
            data : {
                terza : terza,
                user: 'harris'
            }
        }).done(function(data){
        console.log(data);
    });
    },
        
    this.loadCanto = function (noCanto) {
        var self = this;
        noCanto = noCanto || 1;
        this.currentCanto = noCanto; 
        $.ajax({
            url: "/rest/canto/"+noCanto
            }).done(function(response){
            self.populateStanzas(response);
            Kimo.Observable.trigger("cantoLoaded", noCanto, response);
        });
    },
        
    this.populateStanzas = function (stanzas, lang) { 
        var lang = lang || 'it',
        tpl,
        render,
        ctn = $("."+lang+"-canto-container");
        $(ctn).empty();
        tpl = '<p class="stz no-{{no_terza}}" data-no="{{no_terza}}">{{content}}</p>';
        $.each(stanzas, function (i, stanza) {
            render = Mustache.render(tpl, stanza);  
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