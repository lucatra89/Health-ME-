define(function(require) {

    var $ = require("jquery");
    var _ = require("underscore");
    var Backbone = require("backbone");
    var EHU = require("ehutils");
    var LePatologia= require('models/LePatologia');

    var GloPatologie = Backbone.Collection.extend({
        constructorName: "GloPatologie",

        model: LePatologia,

        initialize: function(){
            this.on('sync', function(){
                var now = moment().unix();
                EHU.setLastUpdatePatologie(JSON.stringify(now));
                EHU.setGloPatologie( this.toJSON());
            });

            this.on('add', function(model){
                model.set('id',  model.get('Id'));
            });
        },

        url: function(){
            var url = 'http://' + this.urlRoot + 'patologie';
            var lastUpdate = EHU.getLastUpdatePatologie();

            if(EHU.getLastUpdatePatologie() === null )
                return url;

            return url + '?lastupdate=' + lastUpdate ;
        },

        comparator :function(model){
            return model.get('Nome');
        },


        sync: function(method, collection, options) {
            var self = this;

            if (method == 'read' && EHU.checkConnection()){


                var promise = $.ajax({
                    url : self.url(),
                    type : 'GET',
                    headers: {token : EHU.token,
                              Authorization : EHU.getAuth()
                            },
                    dataType : 'json'
                });


                promise.done(function(response){
                    
                    if (promise.status == 304)
                        return;

                    for ( var i = 0 ; i < response.length ; i++)
                        self.add(response[i], {merge : true});

                    self.trigger('sync');
                });

            }
                
        },


        getById:function(id){

            return this.findWhere( {Id:id});

        }



    });

    return GloPatologie;
});