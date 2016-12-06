define(function(require) {
	var $ = require("jquery");
	var _ = require("underscore");
	var Backbone = require("backbone");
	var Utils = require("utils");
	var moment = require("moment");

	var iDosaggioView= Utils.Page.extend({

		constructorName : "iDosaggioView",

		tagName:'li',

		className:'table-view-cell',


		initialize : function(){
			this.template = Utils.templates.iDosaggio;
			this.on('inTheDOM' , this.rendered);
		},

		render : function(){

			this.el.innerHTML= this.template(this.model.toJSON());

			return this;
		},

		rendered : function(){

			if(this.model.get('Stato') == 'attiva'){
				this.delegateEvents({"longTap a": "select", "tap button":"stop"});
				this.$(".badge").addClass('badge-primary');
			}
		},

		select: function(){
			this.$('a').toggleClass('selected');
		},

		stop : function(){
			this.model.stop();
			this.el.firstChild.classList.remove('selected');
			this.undelegateEvents();
			this.$(".badge").removeClass('badge-primary');
		}


	});

	return iDosaggioView;
});
