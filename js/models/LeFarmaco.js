define(function(require) {

    var $ = require("jquery");
    var _ = require("underscore");
    var Backbone = require("backbone");
    var EHU = require("ehutils");

    var LeFarmaco = Backbone.Model.extend({
        constructorName: "LeFarmaco",

        defaults:{

			Principioattivo:'',
			Nome:'',
			Descrizione:'',
			Gruppoequivalenza: '',
			Categoria: '',
			Indicazioni: '',
			ATC: "",
			AIC: "",
			Quantita:"",
			Parafarmaco:0,
			Azienda:{},
			Misura:""
		},

        sync:function(){}


    });

    return LeFarmaco;
});


