define(function(require) {

    var $ = require("jquery");
    var _ = require("underscore");
    var Backbone = require("backbone");
    var Utils = require("utils");
    var moment = require("moment");

    var StructureView = Backbone.View.extend({
        constructorName: "StructureView",
        id: "main",


        events: {
            "touchend #nav_home": "goToHome",
            "touchend #nav_notifiche": "goToNotifiche",
            "touchend #nav_patologie": "goToPatologie",
            "touchend #nav_farmaci": "goToFarmaci",
            "touchend #nav_note": "goToNote",
            "touchend #close": "closeModal"
        },

        initialize: function(options) {
            // load the precompiled template
            this.template = Utils.templates.structure;
            this.on("inTheDOM", this.rendered);
        },

        render: function(title) {
            // load the template
            this.el.innerHTML = this.template();
            // cache a reference to the content element

            this.contentElement = this.el.querySelector('#content');
            this.modalElement = this.el.querySelector('#modal');

            this.iconLeft = this.el.querySelector(".icon.pull-left");
            this.iconRight = this.el.querySelector(".icon.pull-right");
            this.searcher = this.el.querySelector("input[type='text']");
            this.pageTitle = this.el.querySelector("#title");
            this.modal = this.el.querySelector("#modal");
            this.modalTitle = this.el.querySelector("#modal .title");


            this.on('clearIcon', this.clearIcon);
            this.on('clearSearcher', this.clearSearcher);
            this.on('displayIconLeft', this.displayIconLeft);
            this.on('displayIconRight', this.displayIconRight);
            this.on('changeModal ', this.changeModal);
            this.on('openModal', this.openModal);
            this.on('closeModal', this.closeModal);
            this.on('toggleSearcher' , this.toggleSearcher);
            this.on('incBadge', this.incBadge);
            this.on('resetBadge', this.resetBadge);


            this.activeSearcher();

            return this;
        },

        rendered: function(e) {

            
            // if the app is running on an iOS 7 device, then we add the
            // 20px margin for the iOS 7 status bar
          
            /*if (device.platform == "iOS" && device.version.startsWith("7.")) {
                document.body.style.marginTop = "20px";
                document.body.style.height = "calc(100% - 20px)";
                this.header.style.marginTop = "20px";
            }*/


        },

        // generic go-back function
        goBack: function() {
            // window.history.back();
        },
        //begin of the navigation functions
        goToHome: function() {
            this.activeElement("nav_home");
            Backbone.history.navigate("home", {
                trigger: true
            });
        },
        goToNotifiche: function() {
            this.activeElement("nav_notifiche");
            Backbone.history.navigate("notifiche", {
                trigger: true
            });
        },
        goToPatologie: function() {

            this.activeElement("nav_patologie");
            Backbone.history.navigate("patologie", {
                trigger: true
            });
        },
        goToFarmaci: function() {
            this.activeElement("nav_farmaci");
            Backbone.history.navigate("farmaci", {
                trigger: true
            });
        },
        goToNote: function() {
            this.activeElement("nav_note");
            Backbone.history.navigate("note", {
                trigger: true
            });
        },
        //active the icon of current page
        activeElement: function(idItem) {
            $('#bar-footer>a').removeClass("active");
            var item = $('#' + idItem);
            item.addClass('active');
        },

        displayIconLeft: function(options) {

            var Icon= this.iconLeft;

            Icon.classList.add('icon-' + options.icon);
            Icon.touchEndListener = options.fun;
            Icon.addEventListener('touchend', Icon.touchEndListener);

        },

        displayIconRight: function(options) {

            var Icon = this.iconRight;

            Icon.classList.add('icon-' + options.icon);
            Icon.touchEndListener = options.fun;
            Icon.addEventListener('touchend', Icon.touchEndListener);

        },

        clearIcon: function() {

            var iconL= this.iconLeft;
            var iconR= this.iconRight;

            _.each(iconR.classList, function(element, index, list) {
                if (element.startsWith('icon-'))
                    list.remove(element);
            });
            _.each(iconL.classList, function(element, index, list) {
                if (element.startsWith('icon-'))
                    list.remove(element);
            });
       
            if(iconL.touchEndListener){
                iconL.removeEventListener('touchend', iconL.touchEndListener);
                iconL.touchEndListener = undefined;
            }
            if(iconR.touchEndListener){
                iconR.removeEventListener('touchend', iconR.touchEndListener);
                iconR.touchEndListener = undefined;
            }


        },

        changeModal: function(modal, title) {

            var self = this;

            if (title !== undefined)
                this.modalTitle.innerHTML = title;


            if (this.modalView)
                this.modalView.close();

            if (modal !== undefined) {

                this.modalView = modal;
                modal.render();
                $(modal.el).find(".close-modal").bind('touchend',
                    function(e) {
                        e.preventDefault();
                        self.closeModal();
                    });

                this.modal.appendChild(modal.el);

                this.listenTo(this.modalView, 'closeModal',function(){
                    this.trigger('closeModal');
                });

                this.modalView.trigger('inTheDOM');

            }

        },

        openModal: function() {
            this.modal.classList.add('active');
        },

        closeModal: function() {
            this.modal.classList.remove('active');
        },

        toggleSearcher : function(){
            var titleBar = $(this.el.firstChild);
            var searcher = $(this.searcher);
            titleBar.toggleClass('search');
            if(titleBar.hasClass('search'))
                searcher.focus();
            else{
                searcher.val('');
                this.trigger('searchEvent' , {value :''});
            }
        },

        clearSearcher : function(){
            $(this.el.firstChild).removeClass('search');
            $(this.searcher).val('');
        },

        activeSearcher : function(){
            var self = this;

            $(this.searcher).keyup(_.debounce(function(){

                self.trigger('searchEvent', { value : self.searcher.value });

            }, 450));
            
        },

        incBadge : function(){

            var badge = this.$el.find('#badge');
            if(badge.hasClass('badge')){
                var num =JSON.parse(badge.text());
                badge.text(JSON.parse(++num));
            }
            else{
                badge.addClass('badge');
                badge.text('1');
            }

        },

        resetBadge : function(){
            var badge = this.$el.find('#badge');
            badge.removeClass('badge');
            badge.text('');
        }



        



    });

    return StructureView;

});