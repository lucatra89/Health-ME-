define(function(require) {
	var $ = require("jquery");
	var _ = require("underscore");
	var Backbone = require("backbone");
	var Utils = require("utils");

	var iNotaView= Utils.Page.extend({

		constructorName : "iNotaView",

		tagName:'li',

		className:'table-view-cell media',

		events : {
			"tap a" : "gotoNota"
		},

		initialize : function(){
			this.template = Utils.templates.iNota;
		},

		render : function(){

			var model = this.model.toJSON();
			var lemma = this.model.get('lemma');


			if(lemma)
				model.lemma = lemma.get('Nome');
			else
				model.lemma = undefined;

			if (model.uri.endsWith('nothing.jpg') )
				model.uri = undefined;


			this.el.innerHTML= this.template(model);

			return this;
		},

		gotoNota: function(){
			Backbone.history.navigate('nota/'+this.model.get('idl'), {trigger:true});
		}



	});

	return iNotaView;
});
