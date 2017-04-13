/*global require*/
'use strict';

window.app = require.config({
  baseUrl: 'js/app3',
  context: 'app3',
  paths: {
    'jquery': '//cdnjs.cloudflare.com/ajax/libs/jquery/3.1.1/jquery',
    'angular': '//cdnjs.cloudflare.com/ajax/libs/angular.js/1.6.0/angular',
    'controllers/greet': 'controllers/greet'
  },
  shim: {
    jquery: {
      exports: '$'
    },
    angular: {
      exports: 'angular'
    }
  },
  deps: [
    'app'
  ]
});