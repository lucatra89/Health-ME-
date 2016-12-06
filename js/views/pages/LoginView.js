define(function(require) {
	var $ = require("jquery");
	var _ = require("underscore");
	var Backbone = require("backbone");
	var Utils = require("utils");
	var EHU = require("ehutils");

	var LoginView = Utils.Page.extend({

		constructorName : "LoginView",

		initialize : function(options) {

			this.template = Utils.templates.login;
		},

		className : "login content",

		events : {
			"touchend #login" : "goToLogin",
			// "touchend #register" : "register",
			"focus  input" : "hideButton",
			"blur input " : "displayButton"
		},

		render : function() {
			$(this.el).html(this.template());
			return this;
		},

		goToLogin : function(e) {

			var email = this.el.querySelector('[name=email]').value;
			var password = this.el.querySelector('[name=password]').value;

			if ( (email !== "")  && (password !== "")) {
				EHU.Login(email , password);
			}
		},

		// register : function(e) {
		// 	// DeltaSystem
		// 	var email = this.el.querySelector('[name=email]').value;
		// 	var password = this.el.querySelector('[name=password]').value;

		// 	if ( (email !== "")  && (password !== "")) {
		// 		EHU.Login(email , password);
		// 	}
		// },

		hideButton : function(){
			this.el.querySelector('.bar').style.display = 'none';

		},

		displayButton : function(){
			this.el.querySelector('.bar').style.display = 'block';
		}



	});
	return LoginView;
});