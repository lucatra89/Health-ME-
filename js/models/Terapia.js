define(function(require) {

    var $ = require("jquery");
    var _ = require("underscore");
    var Backbone = require("backbone");
    var moment = require("moment");
    var EHU = require("ehutils");
    var LoNo = require("lono");

    var Farmaci = require('collections/Farmaci');



    var Terapia = Backbone.Model.extend({
        constructorName: "Terapia",

        defaults : {
            Stato : 'attiva',
            Creazione : moment().unix(),
            Nome : "" ,
            Nota : ""
        },

        initialize: function(){
            var self = this;

            this.set('Farmaci', new Farmaci(this.get('Farmaci')));

            this.get('Farmaci').each(function(model){
                model.set('Terapia', self);
            });

            
            this.listenTo( this.get('Farmaci'), 'localSave', function(){
                EHU.saveTerapia(this);
            });
            this.listenTo(this.get('Farmaci'), 'add' , function(model){
                model.set('Terapia' , this);
            });

            this.on('localSave' , function(){
                EHU.saveTerapia(this);
            });

            var fine = moment.unix(this.get('Fine'));

           if(fine.isBefore( moment() , 'day')){
                this.set('Stato', 'completata');
                this.set('sync' , false);
            }
        },


        url: function() {

            return 'http://'+ this.urlRoot + 'account/patologie/'+ this.collection.idPatologia +'/terapie';

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
            }

        },

        onCreate : function(model ,options){

            
            var notconnected = !(EHU.checkConnection() && EHU.isSyncMode());

            if(notconnected){
                model.set('sync', false);
                model.trigger('localSave');
                return;
            }

            var data = _.omit(model.toJSON() , 'sync' , 'idl', 'Farmaci');

            options.data = JSON.stringify(data);
            options.type = 'POST';


            var promise = $.ajax(options);

            promise.done(function(response){
                    console.log(response);
                    model.set('Id', response.Id);
                    model.set('id', response.Id);
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

            var data = _.omit(model.toJSON() , 'sync', 'idl', 'id', 'Farmaci');

            options.data = JSON.stringify(data);
            options.type = 'PUT';
            options.url = options.url +'/' + model.get('Id');

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

        stop : function(){

            var farmaci = this.get('Farmaci');
            this.set('Stato', 'conclusa');
            this.set('Fine', moment().unix());

            farmaci.each(function(model){
                model.stop();
                model.save();
            });

            this.save();
        },

        startAll : function(){

            var farmaci = this.get('Farmaci').models;

            for (var i = 0; i < farmaci.length; i++)
                farmaci[i].start();
            
        },

        resync : function(){
            if(this.get('sync') === false)
                this.save();

            this.get('Farmaci').resync();
        },

        getIdsFarmaci : function(){
            var farmaci = this.get('Farmaci').models;
            var ids = [];

            for (var i = 0; i < farmaci.length; i++)
                ids.push(farmaci[i].get('FarmacoId'));

            return ids;
        }


    });

    return Terapia;
});