define(function(require) {
	var $ = require("jquery");
	var _ = require("underscore");
	var Backbone = require("backbone");
	var Utils = require("utils");
	var EHU = require("ehutils");

	var HomeView = Utils.Page.extend({

		constructorName : "HomeView",

		className:"content",

		initialize : function(options) {
			this.template = Utils.templates.home;
			this.on('inTheDOM', this.rendered);
		},


		events : {
			"touchend #profilo" : "goToProfilo",
			"touchend #sos" : "goToSOS"
		},

		render : function() {
			this.el.innerHTML = this.template(this.model);
			return this;
		},


		goToProfilo : function() {
			Backbone.history.navigate("profilo", {
				trigger : true
			});
		},

		goToSOS : function() {
			var self = this;
			//alert();
			var messaggio = "ALLARME E-HEALTH TECHNOLOGY. Mi trovo in una situazione di emergenza, mi trovo qui :  ";

			navigator.geolocation.getCurrentPosition(function (position) {
				codeAddress(position.coords.latitude, position.coords.longitude, callback);
			}, function() {});

			//alert();

			function codeAddress(lat, lon, callback) {
				var geocoder = new google.maps.Geocoder();
				geocoder.geocode( { 'latLng': new google.maps.LatLng(lat,lon)},
				function(results, status) {
					if (status == google.maps.GeocoderStatus.OK) {
						callback(results[0].formatted_address);
					} else {
						callback("lat:" + lat + "  lon: " + lon);
					}
				});
			}

			var callback = function(indirizzo){
				//alert(indirizzo);
				messaggio = messaggio + indirizzo;
				var sosMode = EHU.getSosMode();
				var href = "http://www.facebook.com";
				//alert(sosMode);
				if(sosMode == 'email')
					href = "mailto:" + EHU.getContactEmail() + "?subject=Allarme&body="+messaggio;
				else
					href = "sms:" + EHU.getContactSms() + ";body=" + messaggio;
				
				window.open(href);

			};

		}

	});
	return HomeView;
});
