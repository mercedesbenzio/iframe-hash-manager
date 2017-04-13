/*global define*/
'use strict';

define([
	'angular'
], function (angular) {
	return ['$scope',
		function ($scope) {
			$scope.greeting = 'Hello, I am App3!';

      $scope.sayHello = function() {
        alert('Hello!');
      };
		}
	];
});
