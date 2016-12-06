define(function(require) {
	var $ = require("jquery");
	var _ = require("underscore");
	var Backbone = require("backbone");
	var Utils = require("utils");

	var iOMisurazioneView= Utils.Page.extend({

		constructorName : "iOMisurazione",

		tagName:'li',

		className:'table-view-cell',


		initialize : function(){
			this.template = Utils.templates.iOMisurazione;
		},

		render : function(){

			this.el.innerHTML= this.template(this.model);

			return this;

		}



	});

	return iOMisurazioneView;
});
