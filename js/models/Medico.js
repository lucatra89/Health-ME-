define(function(require) {

    var $ = require("jquery");
    var _ = require("underscore");
    var Backbone = require("backbone");
    var EHU = require("ehutils");
    
    var Medico = Backbone.Model.extend({
        constructorName: "Medico",

    });


    return Medico;
});


