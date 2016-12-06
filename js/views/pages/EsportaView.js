define(function(require) {
	var $ = require("jquery");
	var _ = require("underscore");
	var Backbone = require("backbone");
	var Utils = require("utils");

	var EsportaView = Utils.Page.extend({

		constructorName : "EsportaView",

		initialize : function(options) {
			this.template = Utils.templates.esporta;
		},
		id : "EsportaView",
		className : "content",
		events : {
			"touchend #esporta_farmaci" : "esportaFarmaci",
			"touchend #esporta_terapie" : "esportaTerapie"
		},
		render : function() {
			$(this.el).html(this.template({}));
			return this;
		},
		esportaFarmaci : function() {
			// TODO
		},
		esportaTerapie : function() {
			// TODO
		}
	});
	return EsportaView;
});
