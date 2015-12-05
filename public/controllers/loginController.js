var crudApp = angular.module('crudApp');

/**
 * Controller for login page template.
 */

 /**
  * Controller for login page template.
  */

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
  		//var email = 'adele@gmail.com';
  		//var password = 'dddd';

  		if(!email){
  			$("#login-error").html("Email required!")
  			$("#login-error").show()
  			return
  		}else if(!password){
  			$("#login-error").html("Password required!")
  			$("#login-error").show()
  			return
  		}

  		var data = {
      		email: email,
      		password: password
      	};
  		$http.post('/auth/local/login', data).success(function(response) {
            $("#signin_popup").modal('hide')
  			$scope.state.is_logged = true;
            $location.path('/feed');
      		$scope.$emit('update_nav_bar', true);
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

  		var data = {
      		email: email,
      		password: pass1,
      		username: username
      	};

  		$http.post('/auth/local/signup', data).success(function(response) {
  			$scope.state.is_logged = true;
            $("#signup_popup").modal('hide')
  			$location.path('/profile');
      		console.log(response);
      	}).error(function (data, status, headers, config) {
      		console.log(data);
            $scope.register_error_msg = data.message;
          	$scope.registerError = true;
        });


  	}



  	$scope.github_signin = function(){

  		$http.get('/auth/github').success(function(data, status, headers, config) {
  				$scope.state.is_logged = true;
              	console.log("back in success");
              }).
              error(function(data, status, headers, config) {
              	console.log('ERROR!');
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
  		//$scope.login(); //Katie
  		$http.get('/auth/loggedInUser').success(function(data, status, headers, config) {
          	$scope.logged = data.logged
          	if($scope.logged){
                $location.path("/feed")
            }
          });


  	};

      start(); //Init

  });
