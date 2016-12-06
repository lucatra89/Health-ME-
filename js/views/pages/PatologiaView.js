define(function(require) {
	var $ = require("jquery");
	var _ = require("underscore");
	var Backbone = require("backbone");
	var Utils = require("utils");

	var PatologiaView= Utils.Page.extend({

		constructorName : "PatologiaView",

		className: "content",

		initialize : function(options) {
			// load the precompiled template

			this.template = Utils.templates.patologia;

			this.on('updated', function(){
				for (var i = 0; i < this.subViews.length; i++)
					this.subViews[i].trigger('inTheDOM');
			});

		},

		events:{

			"touchend #terapie": "goToTerapie",
			"touchend #misurazioni": "goToMisurazioni",
			"touchend #omisurazioni": "goToOMisurazioni"
		},


		render : function() {

			this.on('changeSubViews', this.changeTable);

			this.el.innerHTML=this.template();

			this.segmentedControl= this.$el.find('.segmented-control')[0];

			this.table = this.el.querySelector('.table-view');
			this.content = this.el.querySelector('.content');

			return this;
		},


		setActive :function(id){

			var active = this.segmentedControl.querySelector('.active');

			if(active)
				active.classList.remove('active');


			this.segmentedControl.querySelector('#'+id).classList.add('active');

		},


		changeTable : function( options){

			var model = options.model;
			var View = options.itemView;

			this.setActive(options.tabId);

			var table = this.table.cloneNode();
			$(this.table).remove();
			this.subViews=[];

			var i = 0;
			var subView;
			var self = this;


			for(var j = 0 ; j < model.length ; j++){

				subView = new View({model: model[j]});
				subView.render();

				this.subViews[i++] = subView;

				table.appendChild(subView.el);
				
			}
			
			_.each(this.subViews , function(subView){
				self.listenTo( subView , 'Modal' , function(){
					self.trigger('Modal' , subView.model);
				});
			});


			this.table = table;

			this.content.appendChild(table);

			for (var k = 0; k < this.subViews.length; k++)
				this.subViews[k].trigger('inTheDOM');


		},

		goToTerapie: function(){
			Backbone.history.navigate('patologia/'+this.model+'/terapie', {trigger:true});
		},
		goToMisurazioni: function(){
			Backbone.history.navigate('patologia/'+this.model+'/gmisurazioni', {trigger:true});
		},

		goToOMisurazioni: function(){
			Backbone.history.navigate('patologia/'+this.model+'/omisurazioni', {trigger:true});
		},


	});
	return PatologiaView;
});