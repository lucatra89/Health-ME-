define(function(require) {
	var $ = require("jquery");
	var _ = require("underscore");
	var Backbone = require("backbone");
	var Utils = require("utils");
	var moment = require("moment");
	var EHU = require("ehutils");
	var LoNo = require("lono");
	var Pickers = require("pickers");

	var ProfiloView = Utils.Page.extend({

		constructorName : "ProfiloView",

		initialize : function(options) {
			this.template = Utils.templates.profilo;
			this.on('inTheDOM', this.rendered);
		},

		className : "content",

		events : {
			"blur #nome":"setNome",
			"blur #cognome": "setCognome",
			"blur #altezza": "setAltezza",
			"blur #nascita":"setNascita",
			"blur #peso": "setPeso",
			"blur #allergie":"setAllergie",
			"blur #allergiefarmaci":"setAllergieFarmaci",
			"change #sesso": "setSesso",
			"change #grupposanguigno": "setGruppoSanguigno",
			"change #medico": "setMedico",

			"touchend #logout" : "goToLogout",
		},

		render : function() {

			var profilo = this.model.profilo.toJSON();
			var medici = this.model.medici.toJSON();
			this.el.innerHTML=this.template({profilo : profilo , medici : medici});
			Pickers.init(this.el , 'date');

			return this;
		},

		rendered: function(){

			var profilo = this.model.profilo.toJSON();
			this.$el.find('#sesso option[value=' + profilo.Sesso + ']').attr('selected', 'selected');
			this.$el.find('#grupposanguigno option[value=' + profilo.GruppoSanguigno + ']').attr('selected', 'selected');
			if(profilo.Medico)
				this.$el.find('#medico option[value="' + profilo.Medico + '"]').attr('selected', 'selected');

		},
        
		goToLogout : function() {
			LoNo.freeze();
			EHU.Logout();

		},

		setNome :function(e){
			var model = this.model.profilo;
			var value = e.target.value;

			if (value !== "")
				model.set('Nome' , value);
			else
				model.unset('Nome');
		},

		setCognome :function(e){
			var model = this.model.profilo;
			var value = e.target.value;

			if (value !== "")
				model.set('Cognome' , value);
			else
				model.unset('Cognome');
		},

		setNascita : function(e){
			var model = this.model.profilo;
			var value = e.target.value;
			if(value !== ""){
				model.set('Nascita_s' , value);
				model.set('Nascita' , moment(value , 'DD/MM/YYYY').unix() );
			}
		},

		setAltezza :function(e){
			var model = this.model.profilo;
			var value = JSON.parse(e.target.value);

			if (value !== "")
				model.set('Altezza' , value);
			else
				model.unset('Altezza');
		},

		setPeso :function(e){
			var model = this.model.profilo;
			var value = JSON.parse(e.target.value);

			if (value !== "")
				model.set('Peso' , value);
			else
				model.unset('Peso');
		},

		setAllergie :function(e){
			var model = this.model.profilo;
			var value = e.target.value;

			if (!model.get('Anamnesi'))
				model.set('Anamnesi', {});

				var anamnesi = _.clone(model.get('Anamnesi'));
				model.unset('Anamnesi');
				anamnesi.Allergie = value;
				model.set('Anamnesi', anamnesi);
		},

		setAllergieFarmaci : function(e){
			var model = this.model.profilo;
			var value = e.target.value;

			if (!model.get('Anamnesi'))
				model.set('Anamnesi', {});

				var anamnesi = _.clone(model.get('Anamnesi'));
				model.unset('Anamnesi');
				anamnesi.AllergieFarmaci = value;
				model.set('Anamnesi', anamnesi);
		},

		setSesso : function(e){
			var model = this.model.profilo;
			var value = e.target.value;
			model.set('Sesso', value);
		},

		setMedico : function(e){
			var model = this.model.profilo;
			var value = e.target.value;
			if (value !== "")
				model.set('Medico', JSON.parse(value));
			else
				model.unset('Medico');
		},

		setGruppoSanguigno : function(e){
			var model = this.model.profilo;
			var value = e.target.value;

			model.set('GruppoSanguigno' , value);
		}


	});
	return ProfiloView;
});
