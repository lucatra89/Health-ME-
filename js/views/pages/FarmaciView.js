define(function(require) {
	var $ = require("jquery");
	var _ = require("underscore");
	var Backbone = require("backbone");
	var Utils = require("utils");

	var FarmaciView= Utils.Page.extend({

		constructorName : "FarmaciView",

		className: "content",

		initialize : function(options) {
			// load the precompiled template

			this.template = Utils.templates.farmaci;

			this.on('searchEvent', this.filter);


		},

		events:{

			"touchend #tutti": "goToTuttiFarmaci",
			"touchend #miei": "goToMieiFarmaci"
		},


		render : function() {

			this.on('changeSubViews', this.changeTable);

			this.el.innerHTML=this.template();

			this.segmentedControl= this.el.querySelector('.segmented-control');

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
			var tabId = options.tabId;

			if(tabId)
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

				self.subViews[i++] = subView;

				table.appendChild(subView.el);

			}

			this.table = table;

			this.content.appendChild(table);


		},

		goToTuttiFarmaci: function(){
			
			this.off("searchEvent");
			Backbone.history.navigate('farmaci/tutti', {trigger:true});

			var toSearch = document.getElementById('cerca').value;
			if(toSearch !== "")
				this.trigger("searchEvent" , {value : toSearch} );
		},

		goToMieiFarmaci: function(){

			this.off("searchEvent");
			Backbone.history.navigate('farmaci/miei', {trigger:true});

			var toSearch = document.getElementById('cerca').value;
			if(toSearch !== "")
				this.trigger("searchEvent" , {value : toSearch} );
		}



	});
	return FarmaciView;
});