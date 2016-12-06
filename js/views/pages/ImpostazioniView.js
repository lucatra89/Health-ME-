define(function(require) {
	var $ = require("jquery");
	var _ = require("underscore");
	var Backbone = require("backbone");
	var Utils = require("utils");
	var EHU = require("ehutils");

	var ImpostazioniView = Utils.Page.extend({

		constructorName : "ImpostazioniView",

		initialize : function(options) {
			this.template = Utils.templates.impostazioni;

			this.on('inTheDOM' , this.rendered);
		},

		className : "content",

		events : {
			"toggle #sync" : "toggleSyncServer",
			"toggle #sos" : "toggleSosMode",
			"touchend .icon-left-nav" : "goBack",
			"blur #sms" :'setSms',
			"blur #email" : 'setEmail'
		},

		render : function() {

			this.el.innerHTML = this.template(this.model);

			return this;
		},


		rendered : function(){

			var model= this.model;

			var sync =this.el.querySelector('#sync');
			var sos = this.el.querySelector('#sos');

			if(model.sync)
				sync.classList.add('active');

			if(model.sos == 'sms')
				sos.classList.add('active');
		},

		goBack : function() {
			window.history.back();
		},

		toggleSyncServer : function() {
			EHU.toggleSync();
		},

		toggleSosMode : function() {

			EHU.toggleSosMode();
		},

		setEmail : function(e){

			EHU.setContactEmail(e.target.value);
		},

		setSms : function(e){

			EHU.setContactSms(e.target.value);
		}
	});
	return ImpostazioniView;
});
