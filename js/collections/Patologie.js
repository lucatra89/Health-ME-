define(function(require) {

    var $ = require("jquery");
    var _ = require("underscore");
    var Backbone = require("backbone");
    var moment = require('moment');
    var EHU = require("ehutils");
    var Patologia = require("models/Patologia");

    var Patologie = Backbone.Collection.extend({
        constructorName: "Patologie",

        model: Patologia,

        sync: function(method, collection, options) {


        },
        resync :function(){
            this.each(function(model){
                model.resync();
            });
        },

        getNextTodos: function(){

            var patologie = this.models;
            var nextTodos ={farmaci:[] , misurazioni : []};
            for (var i = 0; i < patologie.length; i++) {
                var todos = patologie[i].getNextTodos();
                nextTodos.farmaci = _.union(nextTodos.farmaci , todos.farmaci);
                nextTodos.misurazioni = _.union(nextTodos.misurazioni , todos.misurazioni);
            }

            nextTodos.farmaci = _.sortBy(nextTodos.farmaci , function(obj){
                return moment(obj.orario , 'HH:mm').unix();
            });
            nextTodos.misurazioni = _.sortBy(nextTodos.misurazioni , function(obj){
                return moment(obj.orario , 'HH:mm').unix();
            });

            return nextTodos;

        },

        getById : function(id){
            return this.findWhere({Id_tipo : id});
        },

        getIdsFarmaci: function(){
            var patologie = this.models;
            var ids = [];
            
            for (var i = 0; i < patologie.length; i++)
                ids = _.union(ids ,patologie[i].getIdsFarmaci());

            return ids;
        }




    });

    return Patologie;
});