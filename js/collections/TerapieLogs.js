define(function(require) {

    var $ = require("jquery");
    var _ = require("underscore");
    var Backbone = require("backbone");
    var EHU = require("ehutils");
    var TerapiaLog = require('models/TerapiaLog');

    var TerapieLogs = Backbone.Collection.extend({
        constructorName: "TerapiaLogs",

        model: TerapiaLog,

        initialize : function(){

            this.on('add', function(newmodel){

                if(this.length == 1){
                    newmodel.set('idl' ,1);
                    return;
                }

                var maxIdModel =this.max(function(model){
                    return model.get('idl');
                });
                var id = maxIdModel.get('idl') + 1;
                newmodel.set('idl' , id);
            });

        },

        resync : function(){
            this.each(function(model){
                model.resync();
            });
        }


    });

    return TerapieLogs;
});