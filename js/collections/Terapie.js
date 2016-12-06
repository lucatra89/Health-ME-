define(function(require) {

    var $ = require("jquery");
    var _ = require("underscore");
    var Backbone = require("backbone");
    var EHU = require("ehutils");
    var Terapia= require("models/Terapia");

    var Terapie = Backbone.Collection.extend({
        constructorName: "Terapie",
        model : Terapia,

        initialize : function(){

            this.on('add', function(newmodel){
                if(this.length == 1){
                    newmodel.set('idl' ,1);
                    return;
                }
                var maxIdModel =this.max(function(model){
                    return model.get('idl');
                });
                var idl = maxIdModel.get('idl') + 1;
                newmodel.set('idl' , idl);
            });
        },

        url : function(){
            return 'http://'+ this.urlRoot + 'account/patologie/'+ this.idPatologia +'/terapie';
        },

        getByIdl : function(id){
            return this.findWhere({idl:id});
        },
        getById : function(id){
            return this.findWhere({Id:id});
        },

        sync : function(method , model){
            if (method !== 'read')
                return;

            var options ={};
            options.url = this.url();
            options.headers = { token : EHU.token,
                                Authorization : EHU.getAuth() };
            options.dataType = 'json';
            options.type = 'GET';

            var promise = $.ajax(options);

            promise.done(this.cloUpdateTerapie());

        },

        resync : function(){
            this.each(function(model){
                model.resync();
            });
        },

        cloUpdateTerapie : function(){
            var self = this;

            return function(response){

                    for ( var i = 0 ; i < response.length ; i++){
                        var toUpd = self.findWhere({ Id : response[i].Id});
                        if(toUpd === undefined){
                            var newmodel = self.add(response[i]);
                            newmodel.startAll();
                            newmodel.trigger('localSave');
                        }
                        else
                            if(response[i].Stato == 'conclusa'  && toUpd.get('Stato') == 'attiva'){
                                toUpd.stop();
                                toUpd.trigger('localSave');
                            }
                    }
            };
        },

        getNextFarm : function(){
            var nextFarm = [];
            var terapie = this.models;


            for (var i = 0; i < terapie.length; i++) {
                var inizio = moment.unix(terapie[i].get('Inizio'));
                if(terapie[i].get('Stato') == 'attiva' &&  !inizio.isAfter(moment() , 'day') ){
                    var farmaci = terapie[i].get('Farmaci');
                    nextFarm = _.union( nextFarm , farmaci.getNext());
                }
             }

             return nextFarm;
        }

    });


    return Terapie;
});



