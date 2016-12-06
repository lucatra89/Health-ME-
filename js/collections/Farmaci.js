define(function(require) {

    var $ = require("jquery");
    var _ = require("underscore");
    var Backbone = require("backbone");
    var moment = require("moment");
    var EHU = require("ehutils");
    var Farmaco = require('models/Farmaco');

    var Farmaci = Backbone.Collection.extend({
        constructorName: "Farmaci",

        model: Farmaco,

        initialize : function(){

            this.on('add', function(newmodel){

                if(this.length == 1){
                    newmodel.set('Id' ,1);
                    return;
                }

                var maxIdModel =this.max(function(model){
                    return model.get('Id');
                });
                var id = maxIdModel.get('Id') + 1;
                newmodel.set('Id' , id);
            });

        },
        comparator:function(model){
            var h = moment.unix(model.get('Inizio')).hours();
            var min = moment.unix(model.get('Inizio')).minutes();
            return moment().hours(h).minutes(min).unix();
        },

        resync : function(){
            this.each(function(model){
                model.resync();
            });
        },

        getNext : function(){
            var nextFarm = [];
            var farmaci = this.models;

            for (var i = 0; i < farmaci.length; i++){
                var orario = moment(farmaci[i].get('Orario') , 'HH:mm');
                if(farmaci[i].get('Stato')=='attiva' && orario.isAfter(moment())){
                    var obj = {
                        nome : farmaci[i].get('Nome'),
                        orario : farmaci[i].get('Orario')
                    };

                    nextFarm.push(obj);
                }
            }

            return nextFarm;

        }
        

    });

    return Farmaci;
});