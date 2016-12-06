define(function(require) {

    var $ = require("jquery");
    var _ = require("underscore");
    var Backbone = require("backbone");
    var EHU = require("ehutils");
    var Medico = require('models/Medico');

    var Medici = Backbone.Collection.extend({
        constructorName: "Medici",

        model: Medico,


        url: function(){
            var url = 'http://' + this.urlRoot + 'medici';
            var lastupdate = EHU.getLastUpdateMedici();

            if(lastupdate === null )
                return url;

            return url + '?lastupdate=' + lastupdate ;
        },

        comparator :function(model){
            return this.get('Cognome') + this.get('Nome');
        },


        sync: function(method, collection, options) {
            var self = this;

            if (method == 'read' && EHU.checkConnection()){

                var promise = $.ajax({
                    url : self.url(),
                    type : 'GET',
                    headers: {token : EHU.token,
                              "Authorization": "Basic " + btoa(EHU.getUsername() + ":" + EHU.getPassword())},
                    dataType : 'json'
                });

                promise.done(function(response){

                    if (promise.status == 304)
                        return;

                    for ( var i = 0 ; i < response.length ; i++)
                        self.add(response[i], {merge : true});

                    var now = moment().unix();
                    EHU.setLastUpdateMedici(JSON.stringify(now));
                    EHU.setMedici( self.toJSON());

                });
            }
                
        },

        getById:function(id){
            return this.findWhere( {id:id});

        }

    });

    return Medici;
});