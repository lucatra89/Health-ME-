define(function (require) {
    var $ = require("jquery");
    var _ = require("underscore");
    var Backbone = require("backbone");
    var Utils = require("utils");

    var AllarmeMisurazioneView = Utils.Page.extend({

        constructorName: "AllarmeMisurazioneView",

        initialize: function (options) {
            // load the precompiled template
            this.template = Utils.templates.allarme_misurazione;
        },
      
        id: "AllarmeMisurazioneView",
        className: "content-view-container",
        events: {
            "touchend #salva" : "salva",
            "touchend #salta" : "salta"
        },
        render: function () {
            $(this.el).html(this.template({}));
            return this;
        },
        salva : function () {
            //TODO salvataggio lettura misurazione
            $("form input").each(function(){
                var input = $(this); // This is the jquery object of the input, do what you will
                console.log(input.attr("name")+" : "+input.val());
            });
            Backbone.history.navigate('chiudiModal',{
                trigger: true
            });
        },
        salta: function () {
            //TODO notifica misurazione non effettuata
            Backbone.history.navigate('chiudiModal',{
                trigger: true
            });
        }
    });
    return AllarmeMisurazioneView;
});