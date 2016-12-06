define(function(require) {
	var $ = require("jquery");
	var _ = require("underscore");
	var Backbone = require("backbone");
	var Utils = require("utils");

	var iTerapiaView= Utils.Page.extend({

		constructorName : "iTerapiaView",

		tagName:'li',

		className:'table-view-cell',

		events : {
			'tap a' : 'goToDetail',
			'tap button' : 'stop'
		},


		initialize : function(){
			this.template = Utils.templates.iTerapia;
			this.on('inTheDOM', this.rendered );

		},

		render : function(){
			var model = this.model.toJSON();
			model.inizio = moment.unix(model.Inizio).format('DD/MM/YYYY');
			model.fine = moment.unix(model.Fine).format('DD/MM/YYYY');

			this.el.innerHTML= this.template(model);
			

			return this;
		},

		rendered : function(){
			var inizio = moment.unix(this.model.get('Inizio'));
			var fine = moment.unix(this.model.get('Fine'));

			var badge = this.el.querySelector('.badge');
			var button = this.$el.find('button');

			if(inizio.isAfter(moment())){
				badge.classList.add('badge-primary');
				badge.classList.add('future');
			}
			else
				if(this.model.get('Stato') == 'attiva'){
					badge.classList.add('badge-primary');
					this.$('a').on('longTap', this.makeSelector());
				}


		},

		makeSelector: function(){
			var self = this;
			return function(){
				$(self.el.firstChild).toggleClass('selected');
			};
		},

		goToDetail : function(){
			var idPatologia = this.model.collection.idPatologia;
			var id = this.model.get('idl');
			Backbone.history.navigate( idPatologia + '/terapia/' + id , {trigger:true});
		},

		stop :function(){
			this.$('a').off('longTap');
			this.el.firstChild.classList.remove('selected');
			this.el.querySelector('.badge').classList.remove('badge-primary');
			
			this.model.stop();

		}

	});

	return iTerapiaView;
});
