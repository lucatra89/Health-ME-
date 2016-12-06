define(function(require) {

    var $ = require("jquery");
    var _ = require("underscore");
    var Backbone = require("backbone");
    var moment = require("moment");
    var EHU = require("ehutils");

    var GloPatologie = require('collections/GloPatologie');

    var Nota = Backbone.Model.extend({
        constructorName: "Nota",


        defaults :{
             "Titolo":"",
             "Descrizione":"",
             "Nota":""
        },

        initialize : function(){

            var gloPatologie;

            this.on('change:PatologiaId', function(){

                gloPatologie = new GloPatologie(EHU.getGloPatologie());
                this.set('lemma' , gloPatologie.getById( this.get('PatologiaId')));
            });

            var idPat = this.get('PatologiaId');
            gloPatologie = new GloPatologie(EHU.getGloPatologie());

            if(idPat)
                this.set('lemma' , gloPatologie.getById(idPat));


            if ( !this.has('uri') || this.get('uri').endsWith('nothing.png'))
                this.generateTempImg();

        },


        url:function(){
                return'http://'+this.urlRoot+ 'account/note';
        },

        sync:function(method, model){

            if (method !== 'create')
                return;


            model.once('always' , function (){
                EHU.saveNota(model);
            });

            if(EHU.checkConnection() && EHU.isSyncMode() ){

                var url = this.url();

                var json = model.toJSON();
                var uri = json.uri;
                json = _.omit(json , 'uri' , 'sync');



                var options = new FileUploadOptions();
                
                options.fileName = model.get('uri').substr(model.get('uri').lastIndexOf('/') + 1);
                options.mimeType = 'image/png';
                options.fileKey = 'file';
                
                options.headers = {
                    token : EHU.token,
                    Authorization: EHU.getAuth()};
                options.trustAllHosts = true;
                options.params = {json : JSON.stringify(json)};

                var transfer = new FileTransfer();

                transfer.upload( uri , encodeURI(url), win, fail, options);

            }
            else {
                model.trigger('always');
            }

            function win(r){
                    var id = JSON.parse(r.response).Id;
                    model.set('sync' ,true);
                    model.trigger('always');
            }

            function fail(error){
                    model.set('sync', false);
                    model.trigger('always');
                   
            }



        },

        generateTempImg : function(){
                var self = this;
                var onInitFs =function (fs) {

                    fs.root.getFile('nothing.png', {create: true}, function(fileEntry) {
                    // Create a FileWriter object for our FileEntry (log.txt).
                    fileEntry.createWriter(function(fileWriter) {
                    fileWriter.onwriteend = function(e) {
                    self.set('uri' , fileEntry.nativeURL);

                    };

                    fileWriter.onerror = function(e) {
                        console.log('Write failed: ' + e.toString());
                    };
                    // Create a new Blob and write it to log.txt.
                    
                    var parts = ['bo'];
                    var blob = new Blob(parts, {type : 'image/png'});

                    fileWriter.write(blob);

                    }, errorHandler);

                    }, errorHandler);
                };

                var errorHandler = function(error){
                 console.log(error);
                };

                window.requestFileSystem(LocalFileSystem.TEMPORARY, 0, onInitFs, errorHandler);


        },

        resync : function(){
            if(this.get('sync')=== false)
                this.save();
        }



    });

    return Nota;
});


