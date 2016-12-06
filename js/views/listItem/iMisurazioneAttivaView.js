define(function(require) {
	var $ = require("jquery");
	var _ = require("underscore");
	var Backbone = require("backbone");
	var Utils = require("utils");

	var iMisurazioneAttivaView= Utils.Page.extend({

		constructorName : "iMisurazione",

		tagName:'li',

		className:'table-view-cell',


		initialize : function(){
			this.template = Utils.templates.iMisurazioneAttiva;
		},

		render : function(){

			this.el.innerHTML= this.template(this.model.toJSON());

			return this;
		}


	});

	return iMisurazioneAttivaView;
});
