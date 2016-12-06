define(function(require) {
	var $ = require("jquery");
	var _ = require("underscore");
	var Backbone = require("backbone");
	var Utils = require("utils");

	var NotaView = Utils.Page.extend({
		constructorName : "NotaView",

		initialize : function(options) {
			this.template = Utils.templates.nota;
		},

		className : "content",


		render : function() {
			var model = this.model.toJSON();
			var lemma = this.model.get('lemma');

			if(lemma)
				model.lemma = lemma.get('Nome');
			else
				model.lemma = undefined;

			this.el.innerHTML= this.template(model);

			return this;
		},

	});
	return NotaView;
});