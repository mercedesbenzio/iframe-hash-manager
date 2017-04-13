/*global require*/
'use strict';

window.app = require.config({
  baseUrl: 'js/app',
  context: 'app',
  paths: {
    'jquery': '//cdnjs.cloudflare.com/ajax/libs/jquery/2.2.4/jquery',
    'angular': '//cdnjs.cloudflare.com/ajax/libs/angular.js/1.3.13/angular',
    'controllers/todo': 'controllers/todo',
    'directives/todoFocus' : 'directives/todoFocus',
    'directives/todoEscape' : 'directives/todoEscape',
    'services/todoStorage' : 'services/todoStorage'
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