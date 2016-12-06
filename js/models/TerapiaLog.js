define(function(require) {

    var $ = require("jquery");
    var _ = require("underscore");
    var Backbone = require("backbone");
    var moment = require("moment");
    var EHU = require("ehutils");

    var TerapiaLog = Backbone.Model.extend({
        constructorName: "TerapiaLog",
        
        defaults:{
            Nota : ""
        },

        initialize : function(){

            this.on('localSave', function(){
                EHU.saveTerapiaLog(this);
            });
            this.on('destroyLog', function(){
                EHU.destroyTerapiaLog(this);
            });
        },


        url:function(){

                return'http://'+this.urlRoot+ 'account/patologie/'+ this.get('idPatologia') + '/terapie/' + this.get('idTerapia') +'/log';
        },

        sync:function(method, model){

            if(method !== 'create')
                return;

            var notconnected = !(EHU.checkConnection() && EHU.isSyncMode());
            if(notconnected || model.get('idTerapia') === undefined){
                model.set('sync', false);
                model.trigger('localSave');
                return;
            }


            var data = model.clone().omit('sync', 'idl' , 'idPatologia', 'idTerapia', 'idlTerapia');
            var options = {};
            
            options.url = this.url();
            options.headers = {token : EHU.token ,  Authorization: EHU.getAuth()};
            options.dataType = 'json';
            options.contentType ='application/json';
            options.data = JSON.stringify(data);
            options.type = 'POST';


            var promise = $.ajax(options);

            promise.done(function(){
                if(model.has('sync'))
                    model.trigger('destroyLog');

            });

            promise.fail(function(){
                model.set('sync', false);
                model.trigger('localSave');
            });


        },

        resync : function(){
            if(this.get('sync') === false)
                this.save();
        }

    });

    return TerapiaLog;
});


