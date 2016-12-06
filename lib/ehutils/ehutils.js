define(function(require) {

    var _ = require('underscore');
    var Backbone = require("backbone");
    var $ = require("jquery");
    var moment = require("moment");
    

    var EHU = {token:'9ETa71jkYoOpQbnZ'};

    _.extend(EHU, Backbone.Events);


    Backbone.Model = Backbone.Model.extend({
        urlRoot: "api.ehealthtechnology.it/api/1.0/"
    });

    Backbone.Collection= Backbone.Collection.extend({

       urlRoot: "api.ehealthtechnology.it/api/1.0/",

    });


    EHU.setLastUpdatePatologie=function(date){
        localStorage.setItem('|+|Patologie-LastUpdate', JSON.stringify(date));
    };

    EHU.getLastUpdatePatologie=function(){

        var date =localStorage.getItem('|+|Patologie-LastUpdate');

        return JSON.parse(date);
    };

    EHU.getGloPatologie= function () {

        var p = localStorage.getItem('|+|Patologie');

        return (p === null) ? p : JSON.parse(p);
             
    };

    EHU.setGloPatologie=function (p) {

        var x = JSON.stringify(p);

        localStorage.setItem('|+|Patologie', x);

    };



    //Utility glossario farmaci

    EHU.setLastUpdateFarmaci=function(date){

        localStorage.setItem('|+|Farmaci-LastUpdate', JSON.stringify(date));
    };

    EHU.getLastUpdateFarmaci=function(){

        var date =localStorage.getItem('|+|Farmaci-LastUpdate');

        return JSON.parse(date);
    };

    EHU.getGloFarmaci= function () {

        var p = localStorage.getItem('|+|Farmaci');

        if (p === null)
            return p;

        return JSON.parse(p);

    };

    EHU.setGloFarmaci=function (p) {

        var x = JSON.stringify(p);

        localStorage.setItem('|+|Farmaci', x);

    };

    //Utility Medici
    EHU.setLastUpdateMedici=function(date){

        localStorage.setItem('|+|Medici-LastUpdate', JSON.stringify(date));
    };

    EHU.getLastUpdateMedici=function(){

        var date =localStorage.getItem('|+|Medici-LastUpdate');

        return JSON.parse(date);
    };

    EHU.getMedici= function () {

        var p = localStorage.getItem('|+|Medici');

        if (p === null)
            return p;

        return JSON.parse(p);

    };

    EHU.setMedici=function (p) {

        var x = JSON.stringify(p);

        localStorage.setItem('|+|Medici', x);

    };

    //Utility creazione account


    function accountReq(username, password) {



        var promise = $.ajax({
            url : 'http://api.ehealthtechnology.it/api/1.0/account',
            headers : {token : EHU.token},
            type :'POST',
            dataType: 'json',
            data : JSON.stringify({ Username: username , Password: password})

        });

        promise.done(function(response) {

            EHU.setUsername(username);

            EHU.setPassword(password);

            buildProfile();

            EHU.trigger('authSuccess');

        });

        promise.fail(function(response) {
            EHU.trigger('authFailed');
        });

    }



    function buildProfile() {

        var settings = JSON.stringify({
            sync: true,
            sos: "email",
            email: "",
            sms: ""
        });


        localStorage.setItem('|+|' + EHU.getUsername() + '-Profilo', '{ }');

        localStorage.setItem('|+|' + EHU.getUsername() + '-Password', EHU.getPassword());

        localStorage.setItem('|+|' + EHU.getUsername() + '-Impostazioni', settings);

        localStorage.setItem('|+|'+EHU.getUsername()+'-Patologie', '[]');

        localStorage.setItem('|+|' + EHU.getUsername() + '-TerapieLog', '[]');

        localStorage.setItem('|+|' + EHU.getUsername() + '-Note', '[]');

        localStorage.setItem('|+|' + EHU.getUsername() + '-Notifiche' , '[]');

    }


    //Utility Profilo

    EHU.getProfilo= function () {

        return JSON.parse(localStorage.getItem('|+|' + EHU.getUsername() + '-Profilo'));

    };

    EHU.setProfilo= function (p) {

        var x = JSON.stringify(p);

        localStorage.setItem('|+|' + EHU.getUsername() + '-Profilo', x);
    };





    //Utility Login

    function login(username, password, ctrpassword) {

        if (ctrpassword == password) {

            EHU.setUsername(username);

            EHU.setPassword(password);

            EHU.trigger('authSuccess');

        } else

            EHU.trigger('authFailed');


    }



    //Utility terapieLog




    // Connessione

    EHU.checkConnection = function() {

        if (navigator.connection.type == Connection.NONE)
            return false;

        return true;
    };




    //Utente corrente

    EHU.getUsername = function() {

        return localStorage.getItem('|+|username');

    };

    EHU.setUsername = function(username) {

        localStorage.setItem('|+|username', username);

    };


    EHU.getPassword = function() {

        return localStorage.getItem('|+|password');

    };

    EHU.setPassword = function(password) {

        localStorage.setItem('|+|password', password);

    };

    EHU.getAuth= function(){
        return "Basic " + btoa(EHU.getUsername() + ":" + EHU.getPassword());
    };

    //account


    //La funzione EHU.Login farà trigger di un authSuccess o authFailed a seconda dei casi

    EHU.Login = function(username, password) {

        var p, u, ctrpassword;

        var cod = !username + !password; // vale 0 se sono definiti entrambi , 1 se è definito uno dei due , 2 se non sono definiti 

        switch (cod) {

            case 0:
                ctrpassword = localStorage.getItem('|+|' + username + '-Password');
                (ctrpassword === null) ? accountReq(username, password) : login(username, password, ctrpassword);
                break;

            case 2:
                u = this.getUsername();
                p = this.getPassword();
                (!u || !p) ? this.Login(1): this.Login(u, p);
                break;

            default:
                this.trigger('authFailed');

        }

    };

    // Logout

    EHU.Logout= function(){

        this.setUsername('');
        this.setPassword('');
        this.trigger('logout');

    };



    //Impostazioni
    EHU.getImpostazioni = function () {

        var i = localStorage.getItem('|+|' + EHU.getUsername() + '-Impostazioni');

        i = JSON.parse(i);

        return i;
    };

    EHU.setImpostazioni = function(i) {

        i = JSON.stringify(i);

        localStorage.setItem('|+|' + EHU.getUsername() + '-Impostazioni', i);

    };

    EHU.isSyncMode = function() {

        var i = EHU.getImpostazioni();

        return i.sync;

    };

    EHU.toggleSync = function() {

        var i = EHU.getImpostazioni();

        i.sync = !i.sync;

        if (i.sync)
            this.trigger('syncNow');

        EHU.setImpostazioni(i);

    };


    EHU.getSosMode = function() {

        return EHU.getImpostazioni().sos;

    };



    EHU.toggleSosMode = function() {

        var i = EHU.getImpostazioni();

        if (i.sos == "email")
            i.sos = "sms";
        else
            i.sos = "email";

        EHU.setImpostazioni(i);

    };


    EHU.setContactSms = function(s) {

        var i = EHU.getImpostazioni();

        i.sms = s;

        EHU.setImpostazioni(i);
    };

    EHU.getContactSms = function() {

        return EHU.getImpostazioni().sms;

    };



    EHU.setContactEmail = function(s) {

        var i = EHU.getImpostazioni();

        i.email = s;

        EHU.setImpostazioni(i);
    };

    EHU.getContactEmail = function() {

        return EHU.getImpostazioni().email;

    };

    //Patologie dell'utente

    EHU.savePatologia=function (model){
        var toCreate = true;
        var data = _.omit(model.toJSON() ,'misurazioni', 'allarmi' , 'terapie', 'lemma' );


        var patologie = EHU.getPatologie();
        _.each(patologie, function(element , index , list){
                                if(element.Id_tipo == data.Id_tipo){
                                    list[index]= data;
                                    toCreate=false;
                                }
        });

        if (toCreate){
            patologie.push(data);
            buildPatologia(model);
        }

        EHU.setPatologie(patologie);
    };

    EHU.removePatologia = function(model){
        var patologie = EHU.getPatologie();

        patologie = _.reject(patologie, function(m){
            return model.get('Id_tipo') == m.Id_tipo;
        });
        localStorage.removeItem(  '|'+ model.get('Id_tipo')+'|'+ EHU.getUsername() +'-Terapie' );
        localStorage.removeItem(  '|'+ model.get('Id_tipo')+'|'+ EHU.getUsername() +'-Misurazioni');
        localStorage.removeItem(  '|'+ model.get('Id_tipo')+'|'+ EHU.getUsername() +'-Allarmi');

        EHU.setPatologie(patologie);
    };



    function buildPatologia(model){
        localStorage.setItem(  '|'+ model.get('Id_tipo')+'|'+ EHU.getUsername() +'-Terapie' , '[]');
        localStorage.setItem(  '|'+ model.get('Id_tipo')+'|'+ EHU.getUsername() +'-Misurazioni' , '[]');
    }


    EHU.getPatologie = function(){

        var patologie=JSON.parse( localStorage.getItem('|+|'+ EHU.getUsername() + '-Patologie') );

        return patologie;

    };

    EHU.setPatologie = function(patologie){

        var s= JSON.stringify(patologie);

        localStorage.setItem('|+|'+ EHU.getUsername() + '-Patologie', s) ;

    };



    //Allarmi 
    EHU.setAllarmi = function(ids , idPatologia){
        localStorage.setItem(  '|'+ idPatologia+'|'+ EHU.getUsername() +'-Allarmi' , JSON.stringify(ids));
    };

    EHU.getAllarmi = function(idPatologia){
        var ids =localStorage.getItem('|'+ idPatologia +'|'+ EHU.getUsername() +'-Allarmi' );
        return JSON.parse(ids);
    };

    //Terapia
    EHU.getTerapie = function(idPatologia){

        var s = localStorage.getItem(  '|'+ idPatologia +'|'+ this.getUsername() +'-Terapie');
        return JSON.parse(s);
    };


    EHU.setTerapie = function( idPatologia, terapie){
        var s = JSON.stringify(terapie);

        localStorage.setItem(  '|'+ idPatologia +'|'+ this.getUsername() +'-Terapie' , s);
    };

    EHU.saveTerapia = function(model){
        var idPatologia = model.collection.idPatologia;
        if (idPatologia === undefined)
            return;

        var terapie = this.getTerapie(idPatologia);


        var toCreate = true;
        var data = model.toJSON();
        var farmaci = data.Farmaci.toJSON();
        _.each(farmaci , function(element , index , list){
            list[index] = _.omit(list[index] , 'Terapia');
        });

        data.Farmaci = farmaci;

        _.each(terapie, function(element , index , list){
                                if(element.idl == data.idl){
                                    list[index]= data;
                                    toCreate=false;
                                }
        });
        if (toCreate)
            terapie.push(data);
        EHU.setTerapie(idPatologia , terapie);

    };


    // Misurazioni
    EHU.getMisurazioni = function(idPatologia){

        var s = localStorage.getItem(  '|'+ idPatologia +'|'+ this.getUsername() +'-Misurazioni');

        return JSON.parse(s);
    };


    EHU.setMisurazioni = function( idPatologia, misurazioni ){

        var s = JSON.stringify(misurazioni);

        localStorage.setItem(  '|'+ idPatologia +'|'+ this.getUsername() +'-Misurazioni' , s);

    };




    // Notifiche


    EHU.getNotifiche = function(){

        var s = localStorage.getItem(  '|+|'+ this.getUsername() +'-Notifiche');

        return JSON.parse(s);
    };


    EHU.setNotifiche = function( collection ){

        var s = JSON.stringify(collection);

        localStorage.setItem(  '|+|'+ this.getUsername() +'-Notifiche' , s);

    };


    EHU.saveNotifica = function(json){
        var notifiche = EHU.getNotifiche();
        notifiche.push(json);
        EHU.setNotifiche(notifiche);
    };

    EHU.destroyNotifica= function(model){
        var notifiche = EHU.getNotifiche();
        notifiche = _.reject(notifiche, function(m){ return model.get('id') == m.id;});
        EHU.setNotifiche(  notifiche) ;
    };


    //Terapie Log

    
    EHU.getTerapieLogs = function () {

        var t = localStorage.getItem('|+|' + EHU.getUsername() + '-TerapieLog');

        t = JSON.parse(t);

        return t;
    };

    EHU.setTerapieLogs = function (t) {

        var x = JSON.stringify(t);

        localStorage.setItem('|+|' + EHU.getUsername() + '-TerapieLog', x);

    };


    EHU.saveTerapiaLog = function(model){
        var t = EHU.getTerapieLogs();

        var exist = _.findWhere(t , { idl : model.get('idl')}) !== undefined;
        if(exist)
            return;
        
        t.push(model.toJSON());
        EHU.setTerapieLogs(t);
    };

    EHU.destroyTerapiaLog = function(model) {

        var t = EHU.getTerapieLogs();

        t = _.filter(t , function(el){
            return t.idl !== model.get('idl');
        });

        EHU.setTerapieLogs(t);

    };


    //Modelli ( Terapia , Note, Misurazioni, Messaggi)


    EHU.saveMisurazione = function(model){
        var idPatologia = model.collection.idPatologia;
        var misurazioni = EHU.getMisurazioni(idPatologia);
        
        var exist = _.findWhere(misurazioni , {idl : model.get('idl') });
        if(exist !== undefined)
            return;

        misurazioni.push(model.toJSON());
        EHU.setMisurazioni(idPatologia , misurazioni);
    };



    //Note
    
    EHU.getNote = function(){

        var s = localStorage.getItem(  '|+|'+ this.getUsername() +'-Note');

        return JSON.parse(s);
    };


    EHU.setNote = function( note ){

        var s = JSON.stringify(note);

        localStorage.setItem(  '|+|'+ this.getUsername() +'-Note' , s);

    };


    EHU.saveNota = function( model){
        var note = EHU.getNote();

        note = _.filter(note , function(nota){
            return nota.idl !== model.get('idl');
        });

        note.push(model);
        EHU.setNote(note);
    };

    //ToDestroy


    EHU.saveToDestroy = function(options){
        var toDestroy = localStorage.getItem('|+|'+EHU.getUsername()+'-toDestroy');
        if(toDestroy === null )
            toDestroy = [];
        else
            toDestroy = JSON.parse(toDestroy);

        toDestroy.push(options);
        localStorage.setItem('|+|'+EHU.getUsername()+'-toDestroy' , JSON.stringify(toDestroy));
    };

    EHU.getToDestroy = function(){
        var toDestroy = localStorage.getItem('|+|'+EHU.getUsername()+'-toDestroy');
        if(toDestroy === null)
            return [];
        else
            return JSON.parse(toDestroy);
    };

    EHU.setToDestroy = function(toDestroy){
        var s = JSON.stringify(toDestroy);
        localStorage.setItem('|+|'+EHU.getUsername()+'-toDestroy' , s);
    };

    return EHU;
});