// create the module
var crudApp = angular.module('crudApp', []);

/**
 * Controller for login page template. 
 */
 crudApp.controller('loginController', function($scope) {
 	$scope.logged = false;
 	$scope.username = null;

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

		$.ajax({
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
		})
	}

	$scope.signup = function(){
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

		$.ajax({
			url: "/auth/local/signup",
			type: "POST",
			contentType: "application/x-www-form-urlencoded",
			data: {'email': email, 'password': pass1, 'username': username},
			success: function(data){
				// Successful login
				location.href = "profile.html"

			},
			error: function(data){
				$("#signup-error").html(data.responseJSON.message)
				$("#signup-error").show()
			}
		})
	}

	$scope.logout = function(){
		$.ajax({
			url: "/auth/logout",
			type: "GET",
			success: function(data){
				location.href = "index.html"
			}
		})
	}


	var start = function(){
		$("#signin_popup").appendTo("body") // Ensures modal shows up
		$("#signup_popup").appendTo("body")

		$.ajax({
			url: "/auth/loggedInUser",
			type: "GET",
			success: function(data){
				$scope.logged = data.logged
				if(data.user){
					$scope.username = data.user.username
				}
				//$scope.$apply()
			}
		})
	};

    start(); //Init

});