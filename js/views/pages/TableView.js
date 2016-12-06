define(function(require) {
	var $ = require("jquery");
	var _ = require("underscore");
	var Backbone = require("backbone");
	var Utils = require("utils");

	var TableView= Utils.Page.extend({

		constructorName : "TableView",

		className: "content",

		initialize : function(options) {
			// load the precompiled template
			this.model = options.model;
			this.itemView = options.itemView;
			this.template = Utils.templates.table;
			this.subViews =[];
		},

		render : function() {

			this.el.innerHTML=this.template();

			this.table = this.$el.find('.table-view').get(0);

			var self = this;
			var i=0;
			var View = this.itemView;
			var subView;


			_.each(this.model ,function(element, index , list){

				subView = new View({model: element});
				subView.render();

				self.subViews[i++] = subView;

				self.table.appendChild(subView.el);


			});

			this.on('inTheDOM' , function(){
				for( var i=0 ; i < self.subViews.length ; i++)
					self.subViews[i].trigger('inTheDOM');
			});

			this.on('updated' , function(){
				for( var i=0 ; i < self.subViews.length ; i++)
					self.subViews[i].trigger('inTheDOM');
			});



			return this;
		}


	});
	return TableView;
});