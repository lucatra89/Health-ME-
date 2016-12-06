define(function(require) {
	var $ = require("jquery");
	var _ = require("underscore");
	var Backbone = require("backbone");

	var Utils = require("utils");

	var mNotFarmacoView = Utils.Page.extend({
		constructorName : "AllarmeFarmacoView",

		initialize : function(options) {
			// load the precompiled template
			this.template = Utils.templates.mNotFarmaco;
		},

		events : {
			"tap #conferma" : "conferma",
			"tap #salta" :"salta"
		},

		render : function() {
			this.el.innerHTML =this.template(this.model.notifica.toJSON());
			return this;
		},
		conferma : function() {

			var idp = this.model.notifica.get('idPatologia');

			this.model.logs.create({
				Assunzione : moment().unix(),
				idPatologia : idp,
				idTerapia : this.model.terapia.get('Id'),
				FarmacoId : this.model.notifica.get('idDosaggio'),
				Stato : 'assunto'
			});
			this.model.notifica.destroy();

		},

		salta : function(){
			var idp = this.model.notifica.get('idPatologia');

			this.model.logs.create({
				Assunzione : moment().unix(),
				idPatologia : idp,
				idTerapia : this.model.terapia.get('Id'),
				idlTerapia : this.model.terapia.get('idl'),
				FarmacoId : this.model.notifica.get('idDosaggio'),
				Stato : "nonassunto"
			});

			this.model.notifica.destroy();

		}
	});
	return mNotFarmacoView;
});