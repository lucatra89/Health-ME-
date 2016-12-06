define(function(require) {
	var $ = require("jquery");
	var _ = require("underscore");
	var Backbone = require("backbone");
	var Utils = require("utils");

	var iFarmacoView= Utils.Page.extend({

		constructorName : "iFarmacoView",

		events : {
			"tap a" : "goToDetail"
		},

		tagName:'li',

		className:'table-view-cell',


		initialize : function(){
			this.template = Utils.templates.iFarmaco;
		},

		render : function(){

			this.el.innerHTML= this.template(this.model.toJSON());

			return this;
		},

		goToDetail: function(){
			Backbone.history.navigate('farmaco/'+ this.model.get('Id'), {trigger :true});
		}



	});

	return iFarmacoView;
});
