define(function(require) {
	var $ = require("jquery");
	var _ = require("underscore");
	var Backbone = require("backbone");
	var moment = require("moment");
	
	var Utils = require("utils");
	var Pickers = require("pickers");
	var LoNo = require("lono");

	var mNuovoFarmacoView = Utils.Page.extend({
		constructorName : "mNuovoFarmacoView",

		initialize : function(options) {
			// load the precompiled template
			this.template = Utils.templates.mNuovoFarmaco;

			this.on('inTheDOM' , this.rendered);
		},
		className : "content",
		events : {
			"touchend #salva" : "salva",
			"change select" : 'onChange'
		},

		render : function() {
			this.el.innerHTML = this.template({ lista : this.model.glof.toJSON()});
			Pickers.init(this.el , 'time');
			return this;
		},

		rendered : function(){
			var id = this.el.querySelector('select').value;
			
			if(id === "")
				return;

			this.el.querySelector('#misura').innerText = this.model.glof.getById(JSON.parse(id)).get('Misura');
		},
		onChange : function() {
			var id = JSON.parse(this.el.querySelector('select').value);
			this.el.querySelector('#misura').innerText = this.model.glof.getById(id).get('Misura');
		},

		salva: function() {
			var hours = moment(this.el.querySelector('#orario').value , 'HH:mm').hours();
			var min = moment(this.el.querySelector('#orario').value , 'HH:mm').minutes();

			var dosaggio = JSON.parse(this.el.querySelector('#dosaggio').value);
			var idFarmaco =  JSON.parse(this.el.querySelector('select').value);
			var farmaco = this.model.glof.getById(idFarmaco);
			var inizio = moment.unix(this.model.terapia.get('Inizio')).set('hours', hours).set('minutes', min);
			var fine = moment.unix(this.model.terapia.get('Fine')).set('hours', hours).set('minutes', min).add('seconds',1);


			var newmodel = this.model.terapia.get('Farmaci').add({
					Inizio:inizio.unix(),
					Fine : fine.unix(),
					Creazione: moment().unix(),
					FarmacoId: idFarmaco,
					Misura:farmaco.get('Misura'),
					Nome : farmaco.get('Nome').split(" ")[0],
					Dosaggio : dosaggio,
					Stato : 'attiva'
			});

			newmodel.start();

			/*var json = {};
            json.title = 'Notifica EHealth';
            json.message = 'Farmaco';
            json.Nome = farmaco.get('Nome') + " " + dosaggio + " " + farmaco.get('Misura');
            json.repeat = 1440;
            json.idPatologia = this.model.terapia.collection.idPatologia;
            json.patologia = this.model.glop.getById(json.idPatologia).get('Nome');
            json.idlTerapia = this.model.terapia.get('idl');
            json.date = inizio.valueOf();
            json.end = fine.valueOf();
            json.idDosaggio = newmodel.get('Id'); 

            newmodel.set('Allarme', LoNo.add(json)); */

            newmodel.save();

		}
	});
	return mNuovoFarmacoView;
});