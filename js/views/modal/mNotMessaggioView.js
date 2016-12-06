define(function(require) {
	var $ = require("jquery");
	var _ = require("underscore");
	var Backbone = require("backbone");

	var Utils = require("utils");

	var mNotMessaggioView = Utils.Page.extend({

		constructorName : "mNotMessaggioView",

		
		initialize : function(options) {
			// load the precompiled template
			this.template = Utils.templates.mNotMessaggio;
		},

		events : {
			"tap #conferma" : "conferma"
		},
		render : function() {
			var model = this.model.notifica.toJSON();

			if(model.PatologiaId)
				model.patologia = this.model.glo.getById(model.PatologiaId).get('Nome');

			this.el.innerHTML =this.template(model);
			return this;
		},
		conferma : function() {
			this.model.notifica.destroy();

		}
});
	return mNotMessaggioView;
});