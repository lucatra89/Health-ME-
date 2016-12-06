define(function(require) {
	var $ = require("jquery");
	var _ = require("underscore");
	var Backbone = require("backbone");

	var Utils = require("utils");

	var mNuovaPatologiaView = Utils.Page.extend({
		constructorName : "mPatologiaView",

		initialize : function(options) {
			this.template = Utils.templates.mNuovaPatologia;

			this.on('inTheDOM', this.rendered);
		},

		className : "content",

		events : {
			"tap #salva" : "salvaPatologia"
		},

		render : function() {
			$(this.el).html(this.template(this.model));
			return this;
		},

		rendered : function(){
			var self = this;
			this.model.patologie.each(function(model){
				var id =JSON.stringify( model.get('Id_tipo') );
				self.$el.find('option[value="'+id+'"]').attr('disabled', 'disabled');
			});
		},

		salvaPatologia : function() {
			var id_tipo = this.el.querySelector('#patologia').value;
			if(id_tipo === "")
				return;
			id_tipo = JSON.parse(id_tipo);

			this.model.patologie.create( {Id_tipo: id_tipo} );


		}
	});
	return mNuovaPatologiaView;
});