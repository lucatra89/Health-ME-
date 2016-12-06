define(function(require) {

    var $ = require("jquery");
    var _ = require("underscore");
    var Backbone = require("backbone");
    var EHU = require("ehutils");

    var LePatologia = Backbone.Model.extend({
        constructorName: "LePatologia",

        defaults:{
			nome:'',
			descrizione:'',
			misurazioni:[]
        },

        sync:function(){},

        getNameMisurazione : function(id){
            var misurazioni = this.get('Misurazioni');

            return _.findWhere(misurazioni , { Id : id}).Nome;
        },

        getNameParametro : function(idMisu , idParam){
            var misurazioni = this.get('Misurazioni');
            var parametri = _.findWhere(misurazioni , { Id : idMisu}).Parametri;
            return _.findWhere(parametri , {Id :idParam}).Nome;
        },

        getNextMisu : function(){
            var misurazioni = this.get('Misurazioni');
            var nextMisu = [];
            for (var i = 0; i < misurazioni.length; i++) {
                
                var orario = misurazioni[i].Orario;
                var repeat = misurazioni[i].Frequenza;
                var m = moment(orario , 'HH:mm:ss');

                while(m.isSame(moment(), 'day')){
                    if(m.isAfter(moment())){
                        var obj = {};
                        obj.nome = misurazioni[i].Nome;
                        obj.orario = m.format('HH:mm');
                        nextMisu.push(obj);
                    }
                    m.add(repeat , 'minutes');
                }
            }

            nextMisu = _.sortBy(nextMisu, function(obj){
                return moment(obj.orario , 'HH:mm').unix();
            });

            return nextMisu;

        }


    });

    return LePatologia;
});


