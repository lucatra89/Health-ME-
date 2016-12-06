define(function(require) {
	var $ = require("jquery");
	var _ = require("underscore");
	var Backbone = require("backbone");
	var Utils = require("utils");

	var InfoView = Utils.Page.extend({

		constructorName : "InfoView",

		initialize : function(options) {
			this.template = Utils.templates.info;
		},
		id : "InfoView",
		className : "content",

		render : function() {
			$(this.el).html(this.template({}));
			return this;
		}
	});
	return InfoView;
});
