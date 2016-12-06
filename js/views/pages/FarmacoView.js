define(function(require) {
	var $ = require("jquery");
	var _ = require("underscore");
	var Backbone = require("backbone");

	var Utils = require("utils");

	var FarmacoView = Utils.Page.extend({

		constructorName : "FarmacoView",

		initialize : function(options) {
			this.template = Utils.templates.farmaco;
		},

		className : "content",

		render : function() {
			this.el.innerHTML= this.template(this.model.toJSON());
			return this;
		},

	});
	return FarmacoView;
});