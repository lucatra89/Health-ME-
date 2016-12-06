//     Utils.js 0.0.1
//     (c) 2013-2014 Ivano Malavolta
//     Utils may be freely distributed under the MIT license.
//     http://www.ivanomalavolta.com

//// TEMPLATES
//  The structure of this module is the following:
//  - key: the name of the template as it must be referenced by the Backbone view
//  - value: the path of the html file containing the HTML fragment of the template
define({

	structure: "templates/structure.html",
	login : "templates/login.html",

	home : "templates/home.html",
	esporta : "templates/esporta.html",
    info : "templates/info.html",
	impostazioni : "templates/impostazioni.html",
	profilo : "templates/profilo.html",
	notifiche : "templates/notifiche.html",
	farmaci : "templates/farmaci.html",
	farmaco : "templates/farmaco.html",
    table : 'templates/table.html',
    patologia : 'templates/patologia.html',
    nota :'templates/nota.html',

    iPatologia :'templates/listItem/patologia.html',
    iGiornoMisurazioni :'templates/listItem/giornomisurazioni.html',
    iOMisurazione :'templates/listItem/omisurazione.html',
    iMisurazioneAttiva :'templates/listItem/misurazioneattiva.html',
    iMisurazioneInattiva :'templates/listItem/misurazioneinattiva.html',
    iTerapia :'templates/listItem/terapia.html',
    iFarmaco : 'templates/listItem/farmaco.html',
    iNota : 'templates/listItem/nota.html',
    iDosaggio : 'templates/listItem/dosaggio.html',
    iNotifica : 'templates/listItem/notifica.html',


    mNuovaPatologia :'templates/modal/nuovapatologia.html',
    mNuovaNota :'templates/modal/nuovanota.html',
    mNuovoFarmaco : "templates/modal/nuovofarmaco.html",
    mNuovaTerapia : "templates/modal/nuovaterapia.html",
    mNotFarmaco : "templates/modal/notificafarmaco.html",
    mNotMessaggio : "templates/modal/notificamessaggio.html",
    mNotMisurazione : "templates/modal/notificamisurazione.html",
    mNotNota : "templates/modal/notificanota.html"

});