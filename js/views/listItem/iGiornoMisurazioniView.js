define(function(require) {
	var $ = require("jquery");
	var _ = require("underscore");
	var Backbone = require("backbone");
	var Utils = require("utils");

	var iGiornoMisurazioniView= Utils.Page.extend({

		constructorName : "iGiornoMisurazioni",

		tagName:'li',

		className:'table-view-cell',

		events :{
			"tap a" : "goToDetail"
		},


		initialize : function(){
			this.template = Utils.templates.iGiornoMisurazioni;
		},

		render : function(){
			var model = {day : this.model};

			this.el.innerHTML= this.template(model);

			var date = moment(this.model , "DD/MM/YYYY");
			if(date.isSame(moment() , 'day'))
				this.el.querySelector('.badge').classList.add('badge-primary');

			return this;
		},

		goToDetail : function(){
			var id = Backbone.history.fragment.split('/')[1];

			var date = moment(this.model , "DD/MM/YYYY").unix();

			Backbone.history.navigate(id+'/misurazioni/'+date , {trigger:true});
		}

	});

	return iGiornoMisurazioniView;
});
