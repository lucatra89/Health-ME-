define(function(require) {
	var $ = require("jquery");
	var _ = require("underscore");
	var Backbone = require("backbone");
	var Utils = require("utils");

	var TerapiaView = Utils.Page.extend({

		constructorName : "TerapiaView",

		initialize : function(options) {
			this.template = Utils.templates.terapia;
			this.idTerapia = options.idTerapia;
			this.idPatologia = options.idPatologia;
			this.assunzioneFarmaci = Utils.pManager.profiloModel
					.getListaPatologie().get(this.idPatologia).getTerapie()
					.get(this.idTerapia).getAssunzioneFarmaci();
		},

		id : "TerapiaView",
		className : "content-view-container",

		events : {
			"longTap #terapia" : "editing",
			"touchend .remove" : "removing",
			"touchend #aggiungiTerapia" : "goToAggiungiTerapia"
		},

		render : function() {
			$(this.el).html(this.template({
			// FARMACI QUI
			}));
			return this;
		},

		getTitle : function() {
			return this.title;
		},

		goToNuovaPatologia : function(e) {
			Backbone.history.navigate("pat_nuova", {
				trigger : true
			});
		},
		goToTerapia : function(e) {
			var target = $(e.target);
			var itemTouched = target.closest("table-view-cell")[0];
			Backbone.history.navigate("terapia/0", {
				trigger : true
			});
		},
		editing : function(e) {
			// TODO
			$("#terapia>li>a").removeClass("selected");
			var target = $(e.target);
			var itemTouched = target.closest(".table-view-cell a");
			itemTouched.addClass("selected");
			// Backbone.history.navigate("terapia/" + itemTouched.id,
		},
		removing : function(e) {
			// TODO
			var target = $(e.target);
			var itemTouched = target.closest(".table-view-cell");
			itemTouched.remove();
		},
		goToAggiungiTerapia : function() {
			Backbone.history.navigate("aggiungiTerapia/0", {
				trigger : true
			})
		}
	});
	return TerapiaView;
});