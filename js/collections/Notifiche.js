define(function(require) {

    var $ = require("jquery");
    var _ = require("underscore");
    var Backbone = require("backbone");
    var EHU = require("ehutils");
    var Notifica = require('models/Notifica');

    var Notifiche = Backbone.Collection.extend({
        constructorName: "Notifiche",

        model: Notifica,

        initialize : function(){

            this.on('add', function(newmodel){

                if(this.length == 1){
                    newmodel.set('id' ,1);
                    return;
                }

                var maxIdModel =this.max(function(model){
                    return model.get('id');
                });
                var id = maxIdModel.get('id') + 1;
                newmodel.set('id' , id);
            });

        },

        comparator : function(model){

            return -model.get('now');
        },


        url: function(){

            return 'http://'+ this.urlRoot + 'account/notifiche';
        },

        sync: function(method, collection, options) {
            var self = this;

            if (method == 'read' && EHU.checkConnection()){

                var promise = $.ajax({
                    url : self.url(),
                    type : 'GET',
                    headers: {token : EHU.token,
                              Authorization: EHU.getAuth()
                    },
                    dataType : 'json'
                });

                promise.done(function(response){

                    if (promise.status == 304)
                        return;

                    for ( var i = 0 ; i < response.length ; i++){
                        response[i].now = moment().valueOf();
                        self.add(response[i], {merge : true});
                        self.trigger('newMessage');
                    }

                    EHU.setNotifiche(self.toJSON());

                });
            }
            
        },


        trace : function(){
            this.on('add' ,function(model){
                EHU.saveNotifica(model);
            });
        }

    });

    return Notifiche;
});