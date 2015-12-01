// create the module
var crudApp = angular.module('crudApp');

/**
 * Controller for login page template. 
 */
 crudApp.controller('loginController', function($scope) {
 	$scope.text = 'Hello aliens, I am coming!';


/* Request the user's Geolocation and store it. */
var start = function(){
	console.log('Hello there!');
};

    start(); //Init

});