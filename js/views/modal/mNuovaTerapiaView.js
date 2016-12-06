define(function(require) {
	var $ = require("jquery");
	var _ = require("underscore");
	var Backbone = require("backbone");
	var moment = require("moment");

	var Pickers = require('pickers');


	var Utils = require("utils");

	var mNuovaTerapiaView = Utils.Page.extend({

		constructorName : "mNuovaTerapiaView",

		initialize : function(options) {
			this.template = Utils.templates.mNuovaTerapia;
			this.on('inTheDOM' , this.rendered);
		},

		className : "content",

		events : {
			"touchend #salva" : "salvaTerapia"
		},

		render : function() {
			this.el.innerHTML = this.template();
			return this;
		},

		rendered : function(){
			Pickers.init(this.el , 'date');
		},

		salvaTerapia : function() {
			var terapie = this.model;
			var inizio = moment(this.el.querySelector('#inizio').value , 'DD/MM/YYYY');
			var fine = moment(this.el.querySelector('#fine').value , 'DD/MM/YYYY');
			if(inizio.isBefore(moment() ,'day') || fine.isBefore(inizio , 'day'))
				return;

			terapie.create({Inizio: inizio.unix() , Fine : fine.unix() });

			this.trigger('closeModal');
		}
	});

	return mNuovaTerapiaView;
});