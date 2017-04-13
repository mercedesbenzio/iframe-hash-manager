/*global require*/
'use strict';

window.app([
  'jquery',
	'angular',
  'controllers/greet'
], function ($, angular, welcomeController) {
	console.log( "Hello, I am App3. My Angular version is " + angular.version.full + ", my jQuery version is " + $.fn.jquery + " and this is my scope", window );

	angular
	.module('demo', [])
  .controller('WelcomeController', welcomeController);

  angular.bootstrap(document.getElementsByTagName('app3'), ['demo']);
});