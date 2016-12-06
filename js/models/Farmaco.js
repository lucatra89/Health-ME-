define(function(require) {

    var $ = require("jquery");
    var _ = require("underscore");
    var Backbone = require("backbone");
    var moment = require("moment");
    var EHU = require("ehutils");
    var LoNo = require("lono");

    var GloFarmaci = require("collections/GloFarmaci");
    var GloPatologie = require("collections/GloPatologie");

    var Farmaco = Backbone.Model.extend({
        constructorName: "Farmaco",

        defaults :{
            Frequenza : 1440
        },

        initialize : function(){

            var fine = moment.unix(this.get('Fine'));

              if(fine.isBefore( moment() , 'day') && this.get('Stato') == "attiva"){
                this.set('Stato', 'completata');
                this.set('sync' , false);
            }

            if(this.get('Orario')=== undefined){
                var orario = moment.unix(this.get('Inizio')).format('HH:mm');
                this.set('Orario', orario);
            }

            if(this.get('Nome') === undefined){
                var nome = new GloFarmaci(EHU.getGloFarmaci()).getById(this.get('FarmacoId')).get('Nome');
                this.set('Nome', nome.split(" ")[0]);

            }

            if(this.get('Misura') === undefined){
                var misura = new GloFarmaci(EHU.getGloFarmaci()).getById(this.get('FarmacoId')).get('Misura');
                this.set('Misura', misura);
            }
        },

        url:function(){
			var url = 'account/patologie/' + this.get('Terapia').collection.idPatologia + '/terapie/' + this.get('Terapia').get('Id') + '/farmaci';
			return	'http://' + this.urlRoot +  url;
        },

        sync:function(method , model){
            var options = {};
            options.url = this.url();
            options.headers = {token : EHU.token ,  Authorization: EHU.getAuth()};
            options.dataType = 'json';
            options.contentType ='application/json';


            switch(method){
                case 'create':
                        this.onCreate(model, options);
                        break;
                case 'update':
                    this.onUpdate(model, options);
                    break;
            }

        },


        onCreate : function(model, options){

            var notconnected = !(EHU.checkConnection() && EHU.isSyncMode());

            if(notconnected || model.get('Terapia').get('Id') === undefined){
                model.set('sync', false);
                model.trigger('localSave');
                return;
            }

            var data = _.omit(model.toJSON() , 'sync', 'Terapia', 'Nome', 'Orario', 'Allarme' );

            options.data = JSON.stringify(data);
            options.type = 'POST';


            var promise = $.ajax(options);

            promise.done(function(response){
                    model.set('id', model.get('Id'));
                    model.set('sync', true);
                    model.trigger('localSave');

            });

            promise.fail(function(){

                model.set('sync', false);
                model.trigger('localSave');
            });


        },

        onUpdate : function(model ,options){

            var notconnected = !(EHU.checkConnection() && EHU.isSyncMode());

            if(notconnected ){
                model.set('sync', false);
                model.trigger('localSave');
                return;
            }

            var data = _.omit(model.toJSON() , 'sync', 'Terapia', 'Nome', 'Orario', 'id', 'Allarme');

            options.data = JSON.stringify(data);
            options.type = 'PUT';


            var promise = $.ajax(options);

            promise.done(function(response){

                    model.set('sync', true);
                    model.trigger('localSave');

            });

            promise.fail(function(){

                model.set('sync', false);
                model.trigger('localSave');
            });

        },
        start : function(){

            var gloFarmaci = new GloFarmaci(EHU.getGloFarmaci());
            var gloPatologie = new GloPatologie(EHU.getGloPatologie());

            var nomefarmaco = gloFarmaci.getById(this.get('FarmacoId')).get('Nome').split(" ")[0];
            var misura = gloFarmaci.getById(this.get('FarmacoId')).get('Misura');

            var nomepatologia = gloPatologie.getById(this.get('Terapia').collection.idPatologia).get('Nome');

            var inizio = moment.unix(this.get('Inizio'));
            var fine = moment.unix(this.get('Fine'));


            var json = {};
            json.title = 'Notifica EHealth';
            json.message = 'Farmaco';
            json.Nome = nomefarmaco + " " + this.get('Dosaggio') + " " + misura;
            json.repeat = 1440;
            json.idPatologia = this.get('Terapia').collection.idPatologia;
            json.patologia = nomepatologia;
            json.idlTerapia = this.get('Terapia').get('idl');
            json.date = inizio.valueOf();
            json.end = fine.valueOf();
            json.idDosaggio = this.get('Id');

            this.set('Allarme', LoNo.add(json));

        },

        stop : function(){
            this.set('Stato', 'conclusa');
            this.set('Fine' , moment().unix());
            LoNo.cancel(this.get('Allarme'));
            this.save();
        },

        resync : function(){
            if(this.get('sync')=== false)
                this.save();
        }


    });

    return Farmaco;
});


