define(function(require) {
	var $ = require("jquery");
	var _ = require("underscore");
	var Backbone = require("backbone");

	var Utils = require("utils");
	var Pickers = require('pickers');

	var mNotMisurazioneView = Utils.Page.extend({
		constructorName : "mNotMisurazioneView",

		initialize : function(options) {
			this.template = Utils.templates.mNotMisurazione;
			this.on('inTheDOM' , this.rendered);
		},

		className : "content",

		events : {
			"tap #salta" : "salta",
			"tap #salva" : "salva"
		},

		render : function() {
			this.el.innerHTML = this.template(this.model.notifica.toJSON());
			return this;
		},

		rendered : function(){
			Pickers.init(this.el , 'time');
		},

		salta: function(){
			this.model.notifica.destroy();
			this.trigger('closeModal');
		},

		salva : function(){
			var serForm = $('form').serializeArray();
			var attributes = {
				Id_tipo : this.model.notifica.get('idMisu'),
				Valori:[]
			};

			for (var i = 0; i < serForm.length; i++) {
				var name = serForm[i].name;
				
				if(name.startsWith('$')){
					
					if(serForm[i].value === "")
						return;

					var obj = {};
					obj.Id = JSON.parse(name.substr(1)) ;
					obj.Valore = serForm[i].value;
					attributes.Valori.push(obj);
				}
				else
					if(name == 'Acquisizione')
						attributes[name] = moment(serForm[i].value , 'HH:mm').unix();
					else
						attributes[name] = serForm[i].value;
			}

			this.model.patologia.get('misurazioni').create(attributes);
			console.log(this.model.notifica);
			this.model.notifica.destroy();
			this.trigger('closeModal');

			
		}


	});
	return mNotMisurazioneView;
});