/*global require*/
'use strict';

window.app = require.config({
  baseUrl: 'js/app2',
  context: 'app2',
  paths: {
    'jquery': '//cdnjs.cloudflare.com/ajax/libs/jquery/1.12.4/jquery',
    'angular': '//cdnjs.cloudflare.com/ajax/libs/angular.js/1.4.14/angular',
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