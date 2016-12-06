define(function(require) {
	var $ = require("jquery");
	var _ = require("underscore");
	var Backbone = require("backbone");
	var Utils = require("utils");

	var NotificheView = Utils.Page.extend({

		constructorName : "NotificheView",

		initialize : function(options) {
			// load the precompiled template
			this.template = Utils.templates.notifiche;
		},

		id : "listaNotificheView",
		className : "content-view-container",

		events : {
			"touchend .allarmeFarmaco" : "goToAllarmeFarmaco",
			"touchend .allarmeMisurazione" : "goToAllarmeMisurazione",
			"touchend .allarmeNota" : "goToAllarmeNota",
			"touchend .allarmeMessaggio" : "goToAllarmeMessaggio"
		},

		render : function() {
			var Utils = require("utils");
			$(this.el).html(this.template({}));
			return this;
		},
		goToAllarmeFarmaco : function(e) {
			// TODO something
			var itemTouchedId = $(e.target).closest("li").attr("id");
			Backbone.history.navigate("allarmeFarmaco/" + itemTouchedId, {
				trigger : true
			});
		},
		goToAllarmeMisurazione : function(e) {
			// TODO something
			var itemTouchedId = $(e.target).closest("li").attr("id");
			Backbone.history.navigate("allarmeMisurazione/" + itemTouchedId, {
				trigger : true
			});
		},
		goToAllarmeNota : function(e) {
			// TODO something
			var itemTouchedId = $(e.target).closest("li").attr("id");
			Backbone.history.navigate("allarmeNota/" + itemTouchedId, {
				trigger : true
			});
		},
		goToAllarmeMessaggio : function(e) {
			// TODO something
			var itemTouchedId = $(e.target).closest("li").attr("id");
			Backbone.history.navigate("allarmeMessaggio/" + itemTouchedId, {
				trigger : true
			});
		}
	});
	return NotificheView;
});