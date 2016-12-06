define(function(require) {

	var Backbone = require("backbone");
	var moment = require("moment");

	// Structure
	var StructureView = require("views/StructureView");

	// App page 
	var LoginView = require("views/pages/LoginView");
	var HomeView = require("views/pages/HomeView");
	var TableView = require("views/pages/TableView");
	var PatologiaView = require("views/pages/PatologiaView");
	var EsportaView = require("views/pages/EsportaView");
	var InfoView = require("views/pages/InfoView");
	var ProfiloView = require("views/pages/ProfiloView");
	var ImpostazioniView = require("views/pages/ImpostazioniView");
	var FarmaciView = require("views/pages/FarmaciView");
	var FarmacoView = require("views/pages/FarmacoView");
	var NotaView = require("views/pages/NotaView");
	var NotificheView = require("views/pages/NotificheView");


	// List Item 
	var iPatologiaView = require("views/listItem/iPatologiaView");
	var iGiornoMisurazioniView = require("views/listItem/iGiornoMisurazioniView");
	var iOMisurazioneView = require("views/listItem/iOMisurazioneView");
	var iTerapiaView =require("views/listItem/iTerapiaView");
	var iFarmacoView= require("views/listItem/iFarmacoView");
	var iNotaView = require("views/listItem/iNotaView");
	var iDosaggioView = require("views/listItem/iDosaggioView");
	var iMisurazioneAttivaView = require("views/listItem/iMisurazioneAttivaView");
	var iMisurazioneInattivaView = require("views/listItem/iMisurazioneInattivaView");
	var iNotificaView = require("views/listItem/iNotificaView");

	// Modal View 
	var mNuovaPatologiaView = require("views/modal/mNuovaPatologiaView");
	var mNuovaNotaView = require("views/modal/mNuovaNotaView");
	var mNuovoFarmacoView = require("views/modal/mNuovoFarmacoView");
	var mNuovaTerapiaView = require("views/modal/mNuovaTerapiaView");
	var mNotMisurazioneView = require("views/modal/mNotMisurazioneView");
	var mNotFarmacoView = require("views/modal/mNotFarmacoView");
	var mNotMessaggioView = require("views/modal/mNotMessaggioView");

	//Collections
	var GloFarmaci = require('collections/GloFarmaci');
	var GloPatologie = require('collections/GloPatologie');
	var Medici = require('collections/Medici');
	var Patologie = require('collections/Patologie');
	var Note = require('collections/Note');
	var Notifiche = require('collections/Notifiche');
	var Terapie = require('collections/Terapie');
	var Farmaci = require('collections/Farmaci');
	var TerapieLogs =require('collections/TerapieLogs');

	//Models
	var Profilo = require('models/Profilo');
	var Nota = require('models/Nota');
	var Patologia = require('models/Patologia');
	var Notifica  = require('models/Notifica');
	var Terapia = require('models/Terapia');
	var Farmaco = require ('models/Farmaco');
	var TerapiaLog = require('models/TerapiaLog');

	//Utility
	var EHU = require('ehutils');
	var LoNo = require('lono');



	var AppRouter = Backbone.Router.extend({
		constructorName : "AppRouter",


		routes : {

			"" : "showStructure",

			"login" : "login",

			"home" : "home",

			"esporta" : "esporta",

			"info" : "info",

			"impostazioni" : "impostazioni",

			"profilo" : "profilo",

			"notifiche" : "notifiche",

			"patologie" : "patologie",

			"patologia/:id" : "patologia",

			"patologia/:id/terapie" : "terapie",

			"patologia/:id/omisurazioni" : "omisurazioni",

			"patologia/:id/gmisurazioni" : "gmisurazioni",

			"farmaci" : "farmaci",

			"farmaci/tutti" : "tuttiFarmaci",

			"farmaci/miei" : "mieiFarmaci",

			"farmaco/:id" : "farmaco",

			"note" : "note",

			"nota/:id" : "nota",

			":idp/terapia/:idl" :"terapia",

			":id/misurazioni/:date":"misurazioni"

		},


		login : function() {
			var page = new LoginView();
			this.changePage(page);
			this.structureView.$el.css('visibility', 'visible');
		},


		/**
		 * 
		 */
		home: function() {

			var self = this;

			var todos = this.patologie.getNextTodos();

			todos.farmaci = todos.farmaci.slice(0,2);
			todos.misurazioni = todos.misurazioni.slice(0 , 2);

			var page = new HomeView({model : todos});
			this.changePage(page, 'Home');

			var optionsL = {
				icon: 'info',
				fun: function(){ Backbone.history.navigate('info', {trigger:true}); }
			};

			var optionsR = {
				icon:'gear',
				fun : function(){ Backbone.history.navigate('impostazioni', {trigger:true}); }
			};

			this.structureView.trigger('displayIconLeft', optionsL);
			this.structureView.trigger('displayIconRight', optionsR);

			this.structureView.$el.css('visibility', 'visible');
		},

		/**
		 * 
		 */
		esporta : function() {
			var page = new EsportaView();
			this.changePage(page, 'Esporta');

			var options = {
				icon:'left-nav',
				fun : function(){ Backbone.history.navigate('home', {trigger:true}); }
			};

			this.structureView.trigger('displayIconLeft',options);
		},

		info: function() {
			var page = new InfoView();
			this.changePage(page, 'Informazioni');

			var options = {
				icon:'left-nav',
				fun : function(){ Backbone.history.navigate('home', {trigger:true}); }
			};

			this.structureView.trigger('displayIconLeft',options);
		},

		/**
		 * 
		 */
		profilo : function() {

			var self = this;

			var model={profilo: self.profilo , medici:self.medici};
	
			var page = new ProfiloView({model: model});
			this.changePage(page , 'Profilo');

			var options = {
				icon:'left-nav',
				fun : function(){ Backbone.history.navigate('home', {trigger:true});}
			};

			this.structureView.trigger('displayIconLeft',options);
		},

		/**
		 * 
		 */
		impostazioni : function() {
			var model = EHU.getImpostazioni();

			var page = new ImpostazioniView({model : model});
			this.changePage(page, 'Impostazioni');

			var options = {
				icon:'left-nav',
				fun : function(){  Backbone.history.navigate('home', {trigger:true}); }
			};

			this.structureView.trigger('displayIconLeft',options);
		},

		/**
		 * 
		 */
		patologie : function(){


			var self = this;
			var model = {patologie:self.patologie , glopatologie:self.gloPatologie.toJSON()};
			var structure=this.structureView;
			var page = new TableView({model: self.patologie.models, itemView: iPatologiaView});
			this.changePage(page, 'Patologie');

			page.listenTo( this.patologie , 'add',  function(){
				page.render();
				page.trigger('updated');
			});

			structure.trigger('changeModal', new mNuovaPatologiaView({model:model}) , 'Aggiungi patologia');

			var options = {
				icon:'plus',
				fun: function(){
					structure.trigger('openModal');

				}
			};

			this.structureView.trigger('displayIconRight' , options );

		},



		patologia :function(id){

				var page = new PatologiaView({ model: id});

				if(this.alreadyExist(page))
					return;

				this.listenTo(page, 'inTheDOM', function(){
					Backbone.history.navigate('patologia/'+id+'/terapie', {trigger:true});
				});

				this.changePage(page);

		},

		/**
		 * 
		 */
		terapie : function(id) {

			var structure = this.structureView;
			var patologia = this.patologie.getById(JSON.parse(id));
			var terapie = patologia.get('terapie');
			var page = this.currentView;
			var self = this;

			var View = iTerapiaView;

			var optionsL = {
				icon : 'left-nav',
				fun : function(){ Backbone.history.navigate('patologie', {trigger:true}); }
			};

			var optionsR = {
				icon : 'plus',
				fun : function(){
					structure.trigger('openModal');
				}
			};

			page.listenTo( terapie , 'add' , function(){
				self.changeSubViews({tabId:'terapie', model:terapie.models, itemView : View});
				if(patologia.get('Stato') === 'attiva')
					structure.trigger('displayIconRight', optionsR);
			});


			this.changeSubViews({tabId:'terapie', model: terapie.models, itemView: View });

			structure.trigger('changeModal', new mNuovaTerapiaView({model:patologia.get('terapie')}), 'Aggiungi terapia');
			structure.trigger('displayIconLeft', optionsL);

			if(patologia.get('Stato') === 'attiva')
				structure.trigger('displayIconRight', optionsR);

		},

		gmisurazioni : function(id) {

			var patologia =this.patologie.getById(JSON.parse(id));
			var misurazioni = patologia.get('misurazioni');
			var days = _.keys(misurazioni.groupByDay());

			var View = iGiornoMisurazioniView;

			var options = {
				icon : 'left-nav',
				fun : function(){ Backbone.history.navigate('patologie', {trigger:true}); }
			};

			this.changeSubViews({tabId:'misurazioni', model: days, itemView: View });

			this.structureView.trigger('displayIconLeft', options);
		},

		omisurazioni : function(id) {

			var options = {
				icon : 'left-nav',
				fun : function(){ Backbone.history.navigate('patologie', {trigger:true}); }
			};

			var Id = JSON.parse(id);
			var lemma = this.patologie.getById(Id).get('lemma');

			var model = lemma.getNextMisu();
			var View = iOMisurazioneView;

			this.changeSubViews({tabId:'omisurazioni', model: model, itemView: View });

			this.structureView.trigger('displayIconLeft', options);
		},



		terapia : function(idp , idl){

			var structure = this.structureView;

			var optionsL = {
				icon : 'left-nav',
				fun : function(){
					Backbone.history.navigate('patologia/' + idp , {trigger:true});
				}
			};

			var terapia= this.patologie.getById(JSON.parse(idp)).get('terapie').getByIdl(JSON.parse(idl));
			var dosaggi = terapia.get('Farmaci');

			var View = iDosaggioView;

			var page = new TableView({model:dosaggi.models, itemView: View});

			page.listenTo(dosaggi , 'add', function(){
				this.model = dosaggi.models;
				this.render();
				this.trigger('updated');
			});
			
			this.changePage(page, 'Terapia');

			structure.trigger('displayIconLeft', optionsL);

			if(terapia.get('Stato') == 'attiva'){

				var optionsR = {
					icon : 'plus',
					fun : function() {
						structure.trigger('openModal');
					}
				};

				var model ={ glof : this.gloFarmaci , glop: this.gloPatologie,  terapia : terapia};

				structure.trigger('changeModal', new mNuovoFarmacoView({model : model}), 'Aggiungi farmaco');
				structure.trigger('displayIconRight', optionsR);

			}
		},

		/**
		 * 
		 */

		/**
		 * 
		 */
		farmaci : function() {

			var page = new FarmaciView();
			var structure = this.structureView;

			if(this.alreadyExist(page))
				return;

			this.listenTo(page, 'inTheDOM', function(){
				Backbone.history.navigate('farmaci/tutti', {trigger:true});
			});

			this.changePage(page, 'Farmaci');

		},

		tuttiFarmaci: function(){

			var self = this;

			var structure = this.structureView;
			var page = this.currentView;

			var farmaci = this.gloFarmaci;
			var filteredModels;

			page.once('searchEvent', function(options){
				var toSearch =options.value;
				if (toSearch === "")
					return;
				filteredModels = farmaci.filter( function(model){
					return model.get('Nome').startsWith(toSearch)  || model.get('Principioattivo').startsWith(toSearch);
				});


				self.changeSubViews({ model: filteredModels , itemView: iFarmacoView ,  clearIcon: false });
				//filtra modello
			});

			this.changeSubViews({tabId:'tutti', model: farmaci.models , itemView: iFarmacoView });

			page.listenTo(structure , 'searchEvent', function(options){
				//Filtra modello
				var toSearch =options.value;
				if (toSearch !== "")
					filteredModels = farmaci.filter( function(model){
						return model.get('Nome').startsWith(toSearch)  || model.get('Principioattivo').startsWith(toSearch);
					});
				else
					filteredModels = farmaci.models;

				self.changeSubViews({ model: filteredModels ,itemView : iFarmacoView , clearIcon: false});
			});

			var options = {
				icon : 'search',
				fun : function(){
					structure.trigger('toggleSearcher');
				}
			};

			structure.trigger('displayIconRight', options);

		},

		mieiFarmaci: function(){

			var self = this;
			var page= this.currentView;
			var structure = this.structureView;

			
			if(this.farmaciInUso === undefined){
				var ids = this.patologie.getIdsFarmaci();
				this.farmaciInUso  = this.gloFarmaci.getByIds(ids);
			}
			var farmaci = this.farmaciInUso;
			var filteredModels;
			var toSearch ;

			page.once('searchEvent', function(options){

				toSearch =options.value;
				if (toSearch === "")
					return;
				filteredModels= farmaci.filter( function(model){
					return model.get('Nome').startsWith(toSearch)  || model.get('Principioattivo').startsWith(toSearch);
				});

				self.changeSubViews({tabId:'miei', model: filteredModels, itemView: iFarmacoView, clearIcon: false });
				//filtra modello
			});

			this.changeSubViews({tabId:'miei', model: farmaci.models, itemView: iFarmacoView });

			page.listenTo(structure , 'searchEvent', function(options){
				//Filtra modello
				toSearch =options.value;
				if (toSearch !== "")
					filteredModels = farmaci.filter( function(model){
					return model.get('Nome').startsWith(toSearch)  || model.get('Principioattivo').startsWith(toSearch);
				});
				else
					filteredModels = farmaci.models;
				self.changeSubViews({ model: filteredModels ,itemView : iFarmacoView, clearIcon: false});
			});

			var options = {
				icon : 'search',
				fun : function(){
					structure.trigger('toggleSearcher');
				}
			};

			structure.trigger('displayIconRight', options);

		},

		/**
		 * 
		 */
		farmaco : function(id) {
			var Id = JSON.parse(id);

			var farmaco = this.gloFarmaci.getById(Id);

			var page = new FarmacoView({model : farmaco});

			var options= {
				icon:'left-nav',
				fun : function(){ Backbone.history.navigate('farmaci', {trigger : true});}
			};

			this.changePage(page, 'Farmaco');
			this.structureView.trigger('displayIconLeft', options );
		},

		/**
		 * 
		 */
		note : function() {

			var structure = this.structureView;

			var options = {
				icon : 'plus',
				fun : function(){
					structure.trigger('openModal');
				}
			};

			var page = new TableView({model:this.note.models, itemView:iNotaView});
			this.changePage(page, "Note");

			page.listenTo(this.note , 'add' , function(){
				page.render();
			});

			var model = { note: this.note , patologie: this.gloPatologie.toJSON()};

			structure.trigger('changeModal', new mNuovaNotaView({model : model}) , 'Aggiungi nota');
			structure.trigger('displayIconRight', options);
		},

		/**
		 * 
		 */
		nota : function(id) {

			var nota = this.note.findWhere({idl : JSON.parse(id)});

			var page = new NotaView({model :nota});
			this.changePage(page, nota.get('Titolo'));

			var options={
				icon:'left-nav',
				fun : function(){ Backbone.history.navigate('note', {trigger:true});}
			};

			this.structureView.trigger('displayIconLeft', options);
		},

		misurazioni : function(id ,date){

			var patologia = this.patologie.getById(JSON.parse(id));
			var timestamp = JSON.parse(date);
			var now = moment();
			var View;
			if(moment.unix(timestamp).isSame(now , 'day'))
				View = iMisurazioneAttivaView;
			else
				View = iMisurazioneInattivaView;

			var models = patologia.get('misurazioni').clone().filterByDay(timestamp);
			var lemma = patologia.get('lemma');

			_.each(models , function(model){
				var Id = model.get('Id_tipo');
				model.set('Nome', lemma.getNameMisurazione(Id));

				var valori = model.get('Valori');
				for (var i = 0; i < valori.length; i++)
					valori[i].Nome = lemma.getNameParametro(Id, valori[i].Id);

				var ora = moment.unix(model.get('Acquisizione')).format('HH:mm');
				model.set('Ora', ora);
			});


			var page = new TableView({model: models , itemView: View});

			this.changePage(page, 'Misurazioni');

		},

		

		aggiungiTerapiaView : function() {
			var page = new AggiungiTerapiaView({});
			this.showModal(page);
		},
		/**
		 * 
		 */

		notifiche : function(){
			var structure = this.structureView;
			var patologie = this.patologie;
			var glopatologie = this.gloPatologie;
			var notifiche = this.notifiche;
			var terapieLogs = this.terapieLogs;

			var page = new TableView({model :this.notifiche.models , itemView : iNotificaView});
			this.changePage(page, 'Notifiche');

			structure.trigger('resetBadge');
			
			page.listenTo(LoNo , 'Notify', function(json){
				structure.trigger('resetBadge');
				this.render();
				this.trigger('updated');
				activeModal();
			});

			var  activeModal =function(){
				_.each(page.subViews , function(subView){
						page.listenTo(subView, 'modal', function(notifica){
						var View , title , patologia , model;

						if(notifica.get('message')== 'Misurazione'){
							title = 'Misurazione';
							View = mNotMisurazioneView;
							patologia = patologie.getById(notifica.get('idPatologia'));
							model = { notifica: notifica , patologia: patologia};
						}
						if(notifica.get('message')== 'Farmaco'){
							title = 'Farmaco';
							View = mNotFarmacoView;
							patologia = patologie.getById(notifica.get('idPatologia'));
							var terapia = patologia.get('terapie').getByIdl(notifica.get('idlTerapia'));
							model = {notifica :notifica , logs : terapieLogs, terapia : terapia};
						}

						if(notifica.get('Sender') !== undefined){
							title = notifica.get('Titolo');
							View = mNotMessaggioView;
							model = {notifica : notifica , glo : glopatologie};

						}
						structure.trigger('changeModal', new View({model :model}) , title);
						structure.trigger('openModal');

					});
				});
			};

			activeModal();

		},


		showStructure : function() {
			
			if (!this.structureView) {
				this.structureView = new StructureView();
				// put the el element of the structure view into the DOM
				document.body.appendChild(this.structureView.render().el);
				this.structureView.trigger("inTheDOM");
				this.structureView.$el.css('visibility', 'hidden');

				this.listenTo(EHU, 'authSuccess',  this.onLogged);

				this.listenTo(EHU, 'authFailed', function(){
					Backbone.history.navigate("login", {trigger : true});
				});

				EHU.Login();
			}

		},

		onLogged: function(){
			var self = this;


			this.gloFarmaci = new GloFarmaci(EHU.getGloFarmaci());
			this.gloPatologie= new GloPatologie(EHU.getGloPatologie());
			this.medici = new Medici(EHU.getMedici());
			
			this.patologie = new Patologie(EHU.getPatologie());

			this.note = new Note(EHU.getNote());
			
			this.profilo = new Profilo(EHU.getProfilo());
			this.profilo.trace();
			
			this.notifiche = new Notifiche(EHU.getNotifiche());
			this.notifiche.trace();
			

			this.terapieLogs = new TerapieLogs(EHU.getTerapieLogs());

			this.terapieLogs.each(function(model){
				if(model.get('idTerapia') === undefined){
					var terapia = self.patologie.get('terapie').getByIdl(model.get('idlTerapia'));
					model.set('idTerapia', terapia.get('Id'));
				}
			});
			

			this.patologie.each(function(model){
				var id_tipo = model.get('Id_tipo');
				model.set('lemma' , self.gloPatologie.getById(id_tipo));
				model.get('terapie').fetch();
			});
			this.patologie.on('add' , function(newmodel){
				var id_tipo = newmodel.get('Id_tipo');
				newmodel.set('lemma' , self.gloPatologie.getById(id_tipo));
			});

			Backbone.history.navigate("home", {trigger : true});

			this.listenTo(this.notifiche , 'newMessage', function(){
				this.structureView.trigger('incBadge');
			});
			this.listenTo(LoNo , 'Notify' , function(json){
				this.structureView.trigger('incBadge');
				this.notifiche.add(json);
			});


			LoNo.initialize(EHU.getUsername());

			
			this.notifiche.fetch();
			this.gloFarmaci.fetch();
			this.gloPatologie.fetch();
			this.medici.fetch();
			this.resync();

			this.listenTo(EHU, 'syncNow', this.resync);
			
			document.addEventListener('online' , function(){
				self.resync();
			});

			document.addEventListener('resume', function(){
				self.patologie.each(function(model){
					model.get('terapie').fetch();
				});
			});


			this.listenTo(EHU, 'logout', function(){
				Backbone.history.navigate('login', {trigger:true});
			});
			
		},

		resync : function(){
			if (EHU.checkConnection() && EHU.isSyncMode()){
				
				this.patologie.resync();
				this.note.resync();
				this.terapieLogs.resync();
				this.profilo.resync();
				
				var toDestroy = EHU.getToDestroy();
				var done = [];
				_.each(toDestroy, function(options){
					var promise = $.ajax(options);
					promise.done(function(){
						done.push(options);
					});
				});

				toDestroy = _.difference(toDestroy , done);
				EHU.setToDestroy(toDestroy);
			}
		}

	});
return AppRouter;
});
