define(function(require) {

    var $ = require("jquery");
    var _ = require("underscore");
    var Backbone = require("backbone");
    var EHU = require("ehutils");
    var Nota = require('models/Nota');


    var Note = Backbone.Collection.extend({
        constructorName: "Note",

        model: Nota,

        initialize :function(){
            this.on('add' , function(){
                var newmodel = this.findWhere({ idl : undefined});
                newmodel.set('idl' , this.length);
            });
        },
        resync : function(){
            this.each(function(model){
                model.resync();
            });
        }


    });

    return Note;
});