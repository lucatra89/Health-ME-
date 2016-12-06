define(function(require) {

    var $ = require("jquery");
    var _ = require("underscore");
    var Backbone = require("backbone");
    var moment = require("moment");
    var EHU = require("ehutils");
    var Misurazione = require('models/Misurazione');

    var Misurazioni = Backbone.Collection.extend({
        constructorName: "Misurazioni",

        model: Misurazione,

        initialize : function(){

            this.on('add', function(newmodel){

                if(this.length == 1){
                    newmodel.set('idl' ,1);
                    return;
                }

                var maxIdModel =this.max(function(model){
                    return model.get('idl');
                });
                var id = maxIdModel.get('idl') + 1;
                newmodel.set('idl' , id);
            });

        },

        groupByDay :function(){
            var array = this.groupBy(function(model){
            var timestamp = model.get('Acquisizione');
            return moment.unix(timestamp).format('DD/MM/YYYY');
            });

            return array;
        },

        filterByDay: function(timestamp){

            var day = moment.unix(timestamp);

            var filtered =this.filter(function(model){
                var a = model.get('Acquisizione');
                return moment.unix(a).isSame(day, 'day');
            });

            return filtered;

        },
        resync : function(){
            this.each(function(model){

                model.resync();
            });
        }


    });

    return Misurazioni;
});