define(function(require) {

    var $ = require("jquery");
    var _ = require("underscore");
    var Backbone = require("backbone");
    var moment = require("moment");
    var EHU = require("ehutils");
    var LoNo = require("lono");

    var Misurazioni = require("collections/Misurazioni");
    var Terapie = require("collections/Terapie");
    var LePatologia = require("models/LePatologia");

    var Patologia = Backbone.Model.extend({
        constructorName: "Patologia",

        defaults : {
            Stato : 'attiva',
            Creazione : moment().unix(),
            Inizio : moment().unix()
        },

        initialize: function(){

            var Id_tipo = this.get('Id_tipo');

            var misurazioni = new Misurazioni(EHU.getMisurazioni(Id_tipo));

            var terapie = new Terapie(EHU.getTerapie(Id_tipo));
            
            misurazioni.idPatologia = this.get('Id_tipo');
            
            terapie.idPatologia = this.get('Id_tipo');
            
            var allarmi = EHU.getAllarmi(Id_tipo);
            if (allarmi === null)
            
                allarmi =[];
            
            misurazioni.Id_tipo = Id_tipo;
            terapie.Id_tipo = Id_tipo;

            this.set("terapie", terapie);
            this.set("misurazioni", misurazioni);
            this.set("allarmi", allarmi);

            this.on('change:Stato' ,function(){
                if(this.get('Stato') == 'attiva'){
                    this.start();
                }
                if(this.get('Stato') == 'conclusa')
                    this.stop();
            });

            this.on('cannotDestroy' ,function(options){
                EHU.saveToDestroy(options);
            });


            this.on('localSave' , function(){
                EHU.savePatologia(this);
            });


        },


        url: function() {

            return 'http://'+ this.urlRoot + 'account/patologie';

        },

        sync: function(method, model) {

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
                case 'delete':
                    this.onDelete(model, options);
                    break;
            }

        },

        onCreate : function(model ,options){

            model.start();
            
            var notconnected = !(EHU.checkConnection() && EHU.isSyncMode());

            if(notconnected){
                model.set('sync', false);
                model.trigger('localSave');
                return;
            }

            var data = _.omit(model.toJSON() , 'sync' ,'misurazioni', 'allarmi' , 'terapie', 'lemma' );

            options.data = JSON.stringify(data);
            options.type = 'POST';


            var promise = $.ajax(options);

            promise.done(function(){
                    model.set('id', model.get('Id_tipo'));
                    model.set('sync', true);
                    model.trigger('localSave');

            });

            promise.fail(function(){
                model.set('sync', false);
                model.trigger('localSave');
            });


        },

        onUpdate: function(model ,options){

            var notconnected = !(EHU.checkConnection() && EHU.isSyncMode());

            if(notconnected){
                model.set('sync', false);
                model.trigger('localSave');
                return;
            }

            var data = _.omit(model.toJSON() , 'sync', 'id' ,'misurazioni', 'allarmi' , 'terapie', 'lemma' );

            options.data = JSON.stringify(data);
            options.type = 'PUT';

            var promise = $.ajax(options);

            promise.done(function(){
                    model.set('sync', true);
                    model.trigger('localSave');

            });

            promise.fail(function(){
                model.set('sync', false);
                model.trigger('localSave');
            });

        },

        onDelete : function(model , options){

            var notconnected = !(EHU.checkConnection() && EHU.isSyncMode());

            options.type = 'DELETE';
            options.url = options.url +'/'+model.get('Id_tipo');


            if(notconnected){
                model.trigger('cannotDestroy', options);
                return;
            }

            model.once('destroy' ,function(){
                model.stop();
                EHU.removePatologia(model);
            });


            var promise = $.ajax(options);

            promise.fail(function(){
                model.trigger('cannotDestroy');
            });

        },


        start: function(){

            var em = this.get('lemma').get('Misurazioni');

            for(var i = 0 ; i< em.length ; i++ ){

                var json ={};
                var orario = em[i].Orario;
                var date = moment(orario, "HH:mm:ss");


                json.Parametri = em[i].Parametri;
                json.Vincoli = em[i].Vincoli;
                json.title = 'Notifica EHealth';
                json.message = 'Misurazione';
                json.Nome = em[i].Nome;
                json.repeat = em[i].Frequenza;
                json.patologia = this.get('lemma').get('Nome');
                json.idPatologia = this.get('Id_tipo');
                json.idMisu = em[i].Id;
                json.date = date.valueOf();
                this.get('allarmi' ).push(LoNo.add(json));
            }

            EHU.setAllarmi(  this.get('allarmi'), this.get('Id_tipo') );

        },

        stop: function(){

            this.set('Conclusione' , moment().unix());

            var ids = this.get('allarmi');

            for(var i=0 ; i<ids.length ; i++)
                LoNo.cancel(ids[i]);
            
            EHU.setAllarmi(  [] , this.get('Id_tipo') );
        },

        resync : function(){
            if(this.get('sync') === false)
                this.save();

            this.get('terapie').resync();
            this.get('misurazioni').resync();
        },

        getNextTodos: function(){

            var nextFarm = this.get('terapie').getNextFarm();
            var nextMisu = this.get('lemma').getNextMisu();

            var nextTodos = {};

            nextTodos.farmaci = nextFarm;
            nextTodos.misurazioni  = nextMisu;

            return nextTodos;

        },

        getIdsFarmaci : function(){

            var terapie = this.get('terapie').models;

            var ids =[];

            for (var i = 0; i < terapie.length; i++)
                ids = _.union(ids , terapie[i].getIdsFarmaci());

            return ids;
            
        }

    });

    return Patologia;
});