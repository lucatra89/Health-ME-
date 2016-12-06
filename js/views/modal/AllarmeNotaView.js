define(function (require) {
    var $ = require("jquery");
    var _ = require("underscore");
    var Backbone = require("backbone");
    var Utils = require("utils");

    var AllarmeNotaView = Utils.Page.extend({

        constructorName: "AllarmeNotaView",

        initialize: function (options) {
            // load the precompiled template
            this.template = Utils.templates.allarme_nota;
        },

        id: "AllarmeNotaView",
        className: "content-view-container",
        events: {
            "touchend #conferma_nota" : "goToConferma",
            "touchend .icon-left-nav" : "goBack",
        },
        render: function () {
            $(this.el).html(this.template({}));
            return this;
        },
        goToConferma : function () {
            //TODO something
            Backbone.history.navigate('chiudiModal',{
                trigger: true
            });
        },
        goBack: function () {
            //TODO
            Backbone.history.navigate('chiudiModal',{
                trigger: true
            });
        }
    });
    return AllarmeNotaView;
});