// create the module
var crudApp = angular.module('crudApp', ['ngRoute']);

/* Configuration of routes. */
crudApp.config(function($routeProvider, $locationProvider) {
	$routeProvider
      // route for the home page
      .when('/login', {
      	templateUrl : 'pages/login.html',
      	controller  : 'loginController'
      })
      // route for the about page
      .when('/profile', {
      	templateUrl : 'pages/profile.html',
      	controller  : 'profileController'
      })

			.when('/', {
      	templateUrl : 'pages/feed.html',
      	controller  : 'feedController'
      });

      $locationProvider.html5Mode(true);
  });



 crudApp.controller('mainController', function($scope, $location) {

 	/*
		1. Dashboard
		- populate the main feed (different methods)
		- populate the side bar for the user
		- populate interests, groups
		- populate name, admin/not admin


  // Initialize the model object
 /* $scope.firstModelObj = {
  	account_name: "",
  	is_admin: false,
  	display_name: "",
  	email: "",
  	show_logout: false,
  	show_name: false,
  	loggedIn: false
  };*/




 });







/**
 * Controller for login page template.
 */
 crudApp.controller('loginController', function($scope, $location, $http) {

 	$scope.logged = false;
 	$scope.username = null;
 	$scope.login_error_msg = "";
 	$scope.register_error_msg = "";
 	$scope.loginError = false;
 	$scope.registerError = false;


	$scope.login = function(){
		var email = $("#login-email").val()
		var password = $("#login-password").val()

		if(!email){
			$("#login-error").html("Email required!")
			$("#login-error").show()
			return
		}else if(!password){
			$("#login-error").html("Password required!")
			$("#login-error").show()
			return
		}

		/*$.ajax({
			url: "/auth/local/login",
			type: "POST",
			contentType: "application/x-www-form-urlencoded",
			data: {'email': email, 'password': password},
			success: function(data){
				// Successful login
				location.href = "profile.html"
			},
			error: function(data){
				$("#login-error").html(data.responseJSON.message)
				$("#login-error").show()
			}
		})*/


		var data = {
    		email: email,
    		password: password
    	};
		$http.post('/auth/local/login', data).success(function(response) {
    		 $location.path('/feed'); 

    	}).error(function (data, status, headers, config) {
    		$scope.login_error_msg = data.message;
        	$scope.loginError = true;
      	});

	}



	$scope.signup = function(){
		//return $location.path('/hey'); // path not hash

		var email = $("#signup-email").val()
		var username = $("#signup-username").val()
		var pass1 = $("#signup-password").val()
		var pass2 = $("#signup-password-conf").val()

		if(!email){
			$("#signup-error").html("Email required!")
			$("#signup-error").show()
			return
		}else if(!pass1){
			$("#signup-error").html("Password required!")
			$("#signup-error").show()
			return
		}else if(!username){
			$("#signup-error").html("Username required!")
			$("#signup-error").show()
			return
		}

		if(pass1 != pass2){
			$("#signup-error").html("Passwords do not match!")
			$("#signup-error").show()
			return
		}

		/*$.ajax({
			url: "/auth/local/signup",
			type: "POST",
			contentType: "application/x-www-form-urlencoded",
			data: {'email': email, 'password': pass1, 'username': username},
			success: function(data){
				// Successful login
				redirect();

			},
			error: function(data){
				$("#signup-error").html(data.responseJSON.message)
				$("#signup-error").show()
			}
		})*/
		var data = {
    		email: email,
    		password: pass1,
    		username: username
    	};
		$http.post('/auth/local/signup', data).success(function(response) {
    		console.log(response);
    	}).error(function (data, status, headers, config) {
    		console.log(data);
          $scope.register_error_msg = data.message;
        	$scope.registerError = true;
      });


	}



	$scope.github_signin = function(){

		$http.get('/auth/github').success(function(data, status, headers, config) {
            	console.log("back in success");
            }).
            error(function(data, status, headers, config) {
            	console.log('ERROR!');
            });

	}

	var redirect = function(){
		console.log('dwdwdfwf');
		$scope.showLogin = false;
 		$scope.showRegister = false;
		return $location.path('/'); // path not hash
	}

	$scope.logout = function(){
		$.ajax({
			url: "/auth/logout",
			type: "GET",
			success: function(data){
				location.href = "index.html"
			}
		})

		$http.get('/auth/logout').success(function(data, status, headers, config) {
        	redirect();
        });

	}



	$scope.login_form = function(){
 		$scope.showLogin = true;
 		$scope.showRegister = false;
 	}
 	$scope.register_form = function(){
 		$scope.showRegister = true;
 		$scope.showLogin = false;
 	}


 	$scope.login_hide = function(){
 		$scope.showLogin = false;
 		$scope.showRegister = false;
 	};



	var start = function(){
		$scope.showLogin = false;
		$scope.showRegister = false;
		//$("#signin_popup").appendTo("#hello") // Ensures modal shows up
		//$("#signup_popup").appendTo("#hello")

		/*$.ajax({
			url: "/auth/loggedInUser",
			type: "GET",
			success: function(data){

				if(data.user){
					$scope.username = data.user.username
				}
				//$scope.$apply()
			}
		})*/

		$http.get('/auth/loggedInUser').success(function(data, status, headers, config) {
        	$scope.logged = data.logged
        	if(data.user){
				$scope.username = data.user.username
			}
        });


	};

    start(); //Init

});

crudApp.controller('feedController', function($scope, $location) {



 /* 
	
1. Dashboard
		- populate the main feed (different methods)
		- populate the side bar for the user
		- populate interests, groups
		- populate name, admin/not admin

 */

 /*var populateInterests = function(){
 	$http.get('/users/profile').success(function(data, status, headers, config) {
        	console.log(data);
    });
 };*/



  $scope.user = {
		interests : [{
			    "_id" : "5654b6c6e903c5aa96a19df2",
			    "name" : "Food"
			},
			{
			    "_id" : "5654b6c6e903c5aa96a19df3",
			    "name" : "Bars"
			},{
			    "_id" : "5654b6c6e903c5aa96a19df4",
			    "name" : "Condo"
			}],
			groups:[{
    "_id" : 13,
    "name" : "Toronto"
},
{
    "_id" : 14,
    "name" : "Etobicoke"
}]
	};
	$scope.showHero = true;
  
  $scope.feed = {
    type: 'group', /* types: dashboard, group, tag */
    group: {
      name: "myGroup"
    },
    tag: {
      name: "myTag"
    },
    posts:[
      {
        user:{
          username: "Chris",
          imageurl: "https://www.gravatar.com/avatar/89e0e971f58af7f776b880d41e2dde43?size=50"
        },
        html:"<p>This is my post!</p>"
      }
    ]
  }






})
