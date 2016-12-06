define(function(require) {

    var $ = require("jquery");
    var _ = require("underscore");
    var Backbone = require("backbone");
    var EHU = require("ehutils");

    var Notifica = Backbone.Model.extend({
        constructorName: "Notifica",

        sync:function(method, model, options){
            if(method =='delete'){
                EHU.destroyNotifica(model);
            }
        
        }


    });

    return Notifica;
});


