// here we put the paths to all the libraries and framework we will use
require.config({
  paths: {
    jquery: '../lib/zepto/zepto', // ../lib/jquery/jquery', 
    underscore: '../lib/underscore/underscore',
    backbone: "../lib/backbone/backbone",
    text: '../lib/require/text',
    async: '../lib/require/async',
    handlebars: '../lib/handlebars/handlebars',
    templates: '../templates',
    spin: '../lib/spin/spin.min',
    moment: '../lib/moment/moment',
    utils: '../lib/utils/utils',
    lono: '../lib/lono/lono',
    ehutils: '../lib/ehutils/ehutils',
    pickers: '../lib/pickers/pickers'
  },
  shim: {
    'jquery': {
      exports: '$'
    },
    'underscore': {
      exports: '_'
    },
    'handlebars': {
      exports: 'Handlebars'
    },
    'moment': {
      exports: 'moment'
    }
  }
});

// We launch the App
require(['underscore', 'backbone', 'utils'], function(_, Backbone, Utils) {

  require(['router'], function(AppRouter) {

    document.addEventListener("deviceready", run, false);

    function run() {

      // DeltaSystem qui bisogna metterci username e password da usare per la basic authentication
/*      var username = "Ivanomalavolta@gmail.com";
      var password = "embe";

      cordovaHTTP.headersHealth = {
        token: "9ETa71jkYoOpQbnZ"
      };
      alert();

      httpSetup(run2);

      function httpSetup(callback) {
        cordovaHTTP.acceptAllCerts(true, function() {
          console.log('success Accept all Certs');
          cordovaHTTP.useBasicAuth(username, password, function() {
            console.log('success Basic Auth');
            callback();
          }, function() {
            console.log('error Basic Auth');
          });
        }, function() {
          console.log('error Accept all Certs');
        });
      }
    }

    function run2() {

      // DeltaSystem - inizio codice di esempio per fare le chiamate HTTPS
      var url = "https://api.ehealthtechnology.it/api/1.0/farmaci";

      cordovaHTTP.get(url, {}, cordovaHTTP.headersHealth, manageResult, manageError);

      function manageResult(response) {
          //debugger;
          //alert(JSON.stringify(response));
          console.log(JSON.stringify(response));
      }

      function manageError(response) {
          //debugger;
          //alert(JSON.stringify(response));
          console.log(JSON.stringify(response));
      }
      // DeltaSystem - fine codice di esempio per fare le chiamate HTTPS       */

      // Here we precompile ALL the templates so that the app will be much quickier when switching views
      // see utils.js
      Utils.loadTemplates().once("templatesLoaded", function() {
        // launch the router
        var router = new AppRouter();
        Backbone.history.start();
      });
    }
  });
});