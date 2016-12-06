define(function(require) {
	var $ = require("jquery");
	var _ = require("underscore");
	var Backbone = require("backbone");
	var Utils = require("utils");

	var iMisurazioneInattivaView= Utils.Page.extend({

		constructorName : "iMisurazione",

		tagName:'li',

		className:'table-view-cell',


		initialize : function(){
			this.template = Utils.templates.iMisurazioneInattiva;
		},

		render : function(){

			this.el.innerHTML= this.template();

			return this;
		}


	});

	return iMisurazioneInattivaView;
});
