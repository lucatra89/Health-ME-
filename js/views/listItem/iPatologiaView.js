define(function(require) {
	var $ = require("jquery");
	var _ = require("underscore");
	var Backbone = require("backbone");
	var Utils = require("utils");
	var EHU = require("ehutils");

	var iPatologiaView= Utils.Page.extend({

		constructorName : "iPatologiaView",

		tagName:'li',

		className:'table-view-cell media',

		events:{
			"tap a" : "goToDetail",
			"longTap a": "onLongTap",
			"swipeLeft a": "onSwipeLeft"
		},

		initialize : function(){
			this.template = Utils.templates.iPatologia;

			this.on('inTheDOM' , this.rendered);
		},

		render : function(){

			this.el.innerHTML= this.template(this.model.get('lemma').toJSON());
			return this;
		},

		rendered : function(){

			var button = this.$el.find('#controller');

			if(this.model.get('Stato') == 'attiva'){
				button.off('tap');
				button.addClass('icon-stop');
				button.on('tap' , this.cloStop());
			}

			if (this.model.get('Stato') == 'conclusa'){
				button.off('tap');
				button.addClass('icon-play');
				button.on('tap' , this.cloRestart());
			}
			
		},

		onLongTap: function(){
				this.$('a').toggleClass('selected');
		},

		onSwipeLeft: function(){
			var a = $(this.el.firstChild);
			a.removeClass('selected');
			a.addClass('swiped');
			this.$el.find('.btn.swipe').addClass('swiped');
			this.delegateEvents({"swipeRight a": "onSwipeRight", "tap a" : "goToDetail", "tap #destroy": "destroy"});
		},

		onSwipeRight: function(){
			var a = $(this.el.firstChild);
			a.removeClass('swiped');
			this.$el.find('.btn.swipe').removeClass('swiped');
			this.delegateEvents({'swipeLeft a': 'onSwipeLeft','longTap a': 'onLongTap', "tap a" : "goToDetail"});
		},

		goToDetail: function(){
			var id = this.model.get('Id_tipo');
			Backbone.history.navigate('patologia/' + id , {trigger : true});
		},

		destroy : function(){
			this.model.destroy();
			if(this.model.isNew()){
                this.model.stop();
                EHU.removePatologia(this.model);
			}
			this.remove();
		},

		cloStop : function(){
			var self = this;

			return function(){
				var button = self.$el.find('#controller');
				button.off('tap');
				button.removeClass('icon-stop');
				button.addClass('icon-play');
				button.on('tap', self.cloRestart());

				self.model.set('Stato', 'conclusa');
				self.model.save();
			};
		},

		cloRestart : function(){
			var self = this;

			return function(){
				var button = self.$el.find('#controller');
				button.off('tap');
				button.removeClass('icon-play');
				button.addClass('icon-stop');
				button.on('tap', self.cloStop());

				self.model.set('Stato', 'attiva');
				self.model.save();
			};
		}


	});

	return iPatologiaView;
});
