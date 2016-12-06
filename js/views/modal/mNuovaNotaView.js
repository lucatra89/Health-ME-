define(function (require) {
    var $ = require("jquery");
    var Backbone = require("backbone");

    var Utils = require("utils");
    var Pickers= require('pickers');

    var Nota =  require("models/Nota");


    var mNuovaNotaView = Utils.Page.extend({

        constructorName: "mNuovaNotaView",



        initialize: function (options) {
            this.template = Utils.templates.mNuovaNota;

            this.model.nota =  new Nota();
        },

        className: "content",
        events: {
            "touchend #scatta": "goToPhoto",
            "touchend #aggiungi": "Aggiungi"
        },
        render: function () {
            //TODO passare al template tutte le patologie disponibili

            this.el.innerHTML = this.template(this.model);

            return this;
        },
        goToPhoto: function () {
            var options = {
                quality : 100,
                destinationType : Camera.DestinationType.FILE_URI,
                encodingType :Camera.EncodingType.PNG,
                saveToPhotoAlbum : false
                };

            navigator.camera.getPicture( this.makeManagerPhoto() , this.errorPhoto , options);
        },

        Aggiungi: function () {

            var note = this.model.note;

            var nota = this.model.nota;

            var titolo = this.el.querySelector('[name=titolo]');
            var descrizione = this.el.querySelector('[name=descrizione]');
            var patologia =  this.el.querySelector('[name=patologia]');

            nota.set('Acquisizione', moment().unix());

            if (titolo)
                nota.set('Titolo', titolo.value);
            if(descrizione)
                nota.set('Descrizione' , descrizione.value);
            if(patologia.value !== "")
                nota.set('PatologiaId' , JSON.parse(patologia.value));

            note.create( nota);

            this.model.nota = new Nota();
            
            titolo.value = "";
            descrizione.value = "";
            patologia.value = "";
            this.el.querySelector('[name=foto]').value = "";

        },

        makeManagerPhoto : function(){
            var self = this;

            return function (uri){

                            self.model.nota.set('uri' , uri);
                            self.el.querySelector('[name=foto]').value='Foto aggiunta';

                    };
        },

        errorPhoto : function( error){
            console.log(error);
        }



    });
    return mNuovaNotaView;
});