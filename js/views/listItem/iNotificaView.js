define(function(require) {
	var $ = require("jquery");
	var _ = require("underscore");
	var Backbone = require("backbone");
	var Utils = require("utils");
	var moment = require("moment");

	var iNotificaView= Utils.Page.extend({

		constructorName : "iNotificaView",

		events : {
			"tap a" : "showModal"
		},

		tagName:'li',

		className:'table-view-cell media notifications',


		initialize : function(){
			this.template = Utils.templates.iNotifica;
			var m = moment(this.model.get('now')).format('HH:mm');
			this.model.set('moment', m);
			
			this.on('inTheDOM' ,this.rendered);
			this.listenTo(this.model, 'destroy', function(){
				this.remove();
			});

		},

		render : function(){
			var model;
			if(this.model.get('message') == 'Misurazione' || this.model.get('message') == 'Farmaco')
				model = this.model.toJSON();
			if(this.model.get('Sender')){
				model ={};
				model.message = this.model.get('Titolo');
				model.body = this.model.get('Descrizione');
				model.moment = moment.unix(this.model.get('Creazione')).format('HH:mm');
			}
			this.el.innerHTML= this.template(model);

			return this;
		},

		rendered : function(){
			var iconClass ;
			if(this.model.get('message') == 'Misurazione')
				iconClass = 'icon-thermometer';
			if(this.model.get('Sender'))
				iconClass = 'icon-message';
			if (this.model.get('message') == 'Farmaco')
				iconClass = 'icon-pill';
			this.el.querySelector('.icon-notification').classList.add(iconClass);
		},



		showModal: function(){
			this.trigger('modal', this.model);
		}



	});

	return iNotificaView;
});