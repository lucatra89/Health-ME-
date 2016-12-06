define(function(require) {

    var $ = require("jquery");
    var _ = require("underscore");
    var Backbone = require("backbone");
    var EHU = require("ehutils");
    var LeFarmaco= require("models/LeFarmaco");

    var GloFarmaci = Backbone.Collection.extend({
        constructorName: "GloFarmaci",

        model: LeFarmaco,

        initialize: function(){
            this.on('sync', function(){
                var now = moment().unix();
                EHU.setLastUpdateFarmaci(JSON.stringify(now));
                EHU.setGloFarmaci( this.toJSON());
            });
        },

        comparator :function(model){
            return model.get('Nome');
        },


        url: function(){
            var url = 'http://' + this.urlRoot + 'farmaci';
            var lastUpdate = EHU.getLastUpdateFarmaci();

            if(EHU.getLastUpdateFarmaci() === null )
                return url;

            return url + '?lastupdate=' + lastUpdate ;
        },


        sync: function(method, collection, options) {
            var self = this;

            if (method == 'read' && EHU.checkConnection()){

                var promise = $.ajax({
                    url : self.url(),
                    type : 'GET',
                    headers: {token : EHU.token,
                              "Authorization": "Basic " + btoa(EHU.getUsername() + ":" + EHU.getPassword())},
                    dataType : 'json',
                });

                promise.done(function(response){
                        if (promise.status == 304)
                            return;
                        var farmaci = [];

                        for ( var i = 0 ; i < response.length ; i++){
                            var model = self.findWhere({Id : response[i].Id});
                            if(model !== undefined)
                                self.remove(model);
                            farmaci.push(response[i]);
                        }

                        self.add(farmaci, {merge : true});
                        self.trigger('sync');

                });
            }
                
        },

        getById:function(id){

            return this.findWhere({Id:id});

        },

        getByIds : function(ids){

            var farmaci= new GloFarmaci();

            for (var i = 0; i < ids.length; i++)
                farmaci.add( this.getById(ids[i]));
            

            return farmaci;
        }

    });

    return GloFarmaci;
});