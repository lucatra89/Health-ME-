define(function(require) {

    var $ = require("jquery");
    var _ = require("underscore");
    var Backbone = require("backbone");
    var moment = require("moment");
    var EHU = require("ehutils");

    var Misurazione = Backbone.Model.extend({
        constructorName: "Misurazione",

        defaults : {
            Creazione : moment().unix()
        },

        initialize : function(){

            this.on('localSave', function(){
                EHU.saveMisurazione(this);
            });
        },


        url:function(){

                return'http://'+this.urlRoot+ 'account/patologie/'+ this.collection.idPatologia + '/misurazioni';
        },

        sync:function(method, model){

            var notconnected = !(EHU.checkConnection() && EHU.isSyncMode());
            if(notconnected){
                model.set('sync', false);
                model.trigger('localSave');
                return;
            }


            var data = model.clone().unset('sync').unset('idl');
            var options = {};
            
            options.url = this.url();
            options.headers = {token : EHU.token ,  Authorization: EHU.getAuth()};
            options.dataType = 'json';
            options.contentType ='application/json';
            options.data = JSON.stringify(data);
            options.type = 'POST';


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
        resync : function(){

            if (this.get('sync')=== false)
                this.save();
        }

    });

    return Misurazione;
});


