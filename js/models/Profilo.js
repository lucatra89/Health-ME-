define(function(require) {

    var $ = require("jquery");
    var _ = require("underscore");
    var Backbone = require("backbone");
    var EHU = require("ehutils");

    var Profilo = Backbone.Model.extend({
        constructorName: "Profilo",

        defaults:{

      /*      Nome : '',
            Cognome : '',
            Nascita : 1,
            LuogoNascita:'',
            Email :'',
            Medico: 1,
            Sesso : 'uomo' ,
            Altezza : 1,
            Peso:1 ,
            GruppoSanguigno:'nonspecificato',
            Religione:'nonspecificato',
            Contatti:[],
            Anamnesi:{ Allergie:'', AllergieFarmaci:''}  */
        },



        url:function(){
            return 'http://' + this.urlRoot+'account/profili';
        },

        sync:function(method, model, options){

            var type;
            var self = this;

            switch(method){
                case 'create':
                    type = 'POST';
                    break;

                case 'update':
                    type = 'PUT';
                    break;

                default:
                    return;
            }


            if(EHU.checkConnection() && EHU.isSyncMode()){

                var clone = model.clone();
                var contatto = { Id : 0 , Nome: 'Contatto principale', Cognome: 'Contatto principale',Ruolo:'altro', Tel:EHU.getContactSms() , Email: EHU.getContactEmail()};
                
                clone.set('Contatti' , [contatto]) ;
                clone.unset('sync');
                clone.unset('id');
                clone.unset('Nascita_s');

                var promise = $.ajax({
                    url: self.url(),
                    type: type,
                    headers:{ token: EHU.token,
                              Authorization: EHU.getAuth()
                            },
                    dataType:'json',
                    contentType:'application/json',
                    data : JSON.stringify(clone)
                });

                promise.done(function(){
                    if(method == 'create')
                        model.set('id' , '');
                    model.trigger('sync');
                });

                promise.always(function(){
                    model.unset('Contatti', {silent:true});
                });


            }
        },


        trace: function(){
            var self = this;
            this.on('change', function(){
                this.set('sync' , 'false', {silent:true});
                EHU.setProfilo(self);

                if(!self.timeout)
                    self.timeout = setTimeout(function() {

                        self.save();
                        self.timeout = undefined;
                    }, 5000);
            });

            this.on('sync' , function(){
                this.set('sync', 'true' , {silent:true});
                this.unset('Contatti');
                EHU.setProfilo(self);
            });
        },

        resync : function(){
            if (this.get('sync') === false)
                this.save();
        }


    });

    return Profilo;
});


