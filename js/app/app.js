/*global require*/
'use strict';

window.app([
	'jquery',
	'angular',
	'controllers/todo',
	'directives/todoFocus',
	'directives/todoEscape',
	'services/todoStorage'
], function ($, angular, todoCtrl, todoFocusDir, todoEscapeDir, todoStorageSrv) {
	console.log( "Hello, I am App. My Angular version is " + angular.version.full + ", my jQuery version is " + $.fn.jquery + " and this is my scope", window );

  angular
	.module('todomvc', [todoFocusDir, todoEscapeDir, todoStorageSrv])
	.controller('TodoController', todoCtrl);

	angular.bootstrap(document.getElementsByTagName('app'), ['todomvc']);
});