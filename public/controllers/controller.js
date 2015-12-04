// create the module
var crudApp = angular.module('crudApp', ['ngRoute']);

/* Service to share data between controllers. Used to share user email
for navigation to and display of profile page. */
crudApp.service('sharedService', function() {
	var _dataObj = {};

	var setData = function(newObj) {
		_dataObj = newObj;
	};

	var getData = function(){
		return _dataObj;
	};

	return {
		getData: getData,
		setData: setData
	};

});

/* Configuration of routes. */
crudApp.config(function($routeProvider, $locationProvider) {
	$routeProvider
      // route for the home page

     .when('/login', {
      	templateUrl : 'pages/login.html',
      	controller  : 'loginController'
      })
     // route for the admin page
     .when('/admin', {
        templateUrl: 'pages/admin/userList.html',
        controller: 'userController'
     })
     .when('/admin/users', {
        templateUrl: 'pages/admin/userList.html',
        controller: 'userController'
     })
    .when('/admin/posts', {
        templateUrl: 'pages/admin/postList.html',
        controller: 'postController'
     })
    .when('/admin/interests', {
        templateUrl: 'pages/admin/interestList.html',
        controller: 'interestController'
     })
    .when('/admin/groups', {
        templateUrl: 'pages/admin/groupList.html',
        controller: 'groupController'
     })
      // route for the about page
      .when('/profile', {
      	templateUrl : 'pages/profile.html',
      	controller  : 'profileController'
      })

	  .when('/feed', {
      	templateUrl : 'pages/feed.html',
      	controller  : 'feedController'
      })
      // route for the about page
      .when('/profile/:username', {
      	templateUrl : 'pages/profile.html',
      	controller  : 'profileController'
      })
	  .when('/', {
      	templateUrl : 'pages/login.html',
      	controller  : 'loginController'


      $locationProvider.html5Mode(true);
  });



crudApp.config(function ($routeProvider, $locationProvider) {
	
	$locationProvider.html5Mode({enabled: true,requireBase: false});
});


 crudApp.controller('mainController', function($scope, $location, $http, $route, sharedService) {

 	$scope.showNavBar = false;
 	$scope.$on("update_nav_bar", function(event, show){
			$scope.showNavBar = show;
			console.log('I am triggered!');
			populateNavBar();
 			

			/* Trigger the fill in methods */
	});

	$scope.$on("update_test", function(event){
			console.log('update_test I am triggered! ' + $scope.state.is_group_page);


			/* Trigger the fill in methods */
	});
	

 	/*
		1. Dashboard
		- populate the main feed (different methods)
		- populate the side bar for the user
		- populate interests, groups
		- populate name, admin/not admin
	 */

 	$scope.state = {
        username: 'Chris',
         admin: true,
         super_admin: true,
         profile_is_admin: true,
         main_dashboard: true,
         admin_dashboard : false,
         is_logged : true, 
         is_searching: false,
         is_group_page: false,
         is_showing_interest: false,

         //The search bar is in the scope of the feedController
         //Question: if we overwrite is_showing_interest in feedContrl, will it be 
      };

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
			    "name" : "Hello"
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

    
    
$scope.logOut = function() {
 alert('logOut');
}   
    

 $scope.getPostByInterest = function(interest_id) {
 	 resetStateVariables();
	 $scope.state.is_showing_interest = true;
	 sharedService.setData({interestid : interest_id});
	 $location.path("/feed");
  	 $route.reload();

 };

$scope.getPostByGroup = function(group_id){
	console.log('getPostByGroup: ' + group_id);
	resetStateVariables();
	$scope.state.is_group_page = true;
	sharedService.setData({groupid : group_id});
  	$location.path("/feed");
  	$route.reload();
};

 $scope.getAdminDashBoard = function() {
 	alert('Admin Dash!');
 	
};

$scope.getMainDashBoard = function() {
	resetStateVariables();
 	$scope.state.main_dashboard = true; 
 	$location.path("/feed");
  	$route.reload();	
};


var resetStateVariables = function () {
	$scope.state.main_dashboard = false;
	$scope.state.is_showing_interest = false;
	$scope.state.is_group_page = false;
	$scope.state.main_dashboard = false;
	$scope.state.admin_dashboard = false;
	$scope.state.admin_dashboard = false;
	$scope.state.is_searching = false;
};

 $scope.getUserProfile = function(user_name) {
 alert(user_name);
 /* Navigate to User Profile page with this username. */
};

 var populateNavBar = function(){
	$http.get('/auth/loggedInUser').success(function(data, status, headers, config) {
    	var account = data.user.accounttype;
    	if (account == 0){
    		$scope.state.admin = true;
         	$scope.state.super_admin = true;
    	} else if (account == 1){
    		$scope.state.admin = true;
         	$scope.state.super_admin = false;
         } else {
         	$scope.state.admin = false;
         	$scope.state.super_admin = false;
         }
   		//var username = data.user.username; //Should be a JSON object
   		$scope.state.username = data.user.username;
    	//var id = data.user._id;
		populateInterests(data.user.username);
		populateUserGroups();
    });
 };

 var populateUserGroups = function(){
  	$http.get('/users/user/groups').success(function(data, status, headers, config) {
        $scope.user.groups = data;

    });
 };

 var populateInterests = function(username){
 	$http({
  		method: 'GET',
        url: '/users/profile', //get all user emails & displayname
        params: {username: username}
    })
  	.then(function successCallback(response) {
  		$scope.user.interests = response.data.interests;

    },
    function errorCallback(response) {
    	console.log(response);

    });
 };  



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
		//var email = $("#login-email").val()
		//var password = $("#login-password").val()
		var email = 'adele@gmail.com';
		var password = 'dddd';

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
			$scope.state.is_logged = true;
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

	var redirect = function(){
		console.log('dwdwdfwf');
		$scope.showLogin = false;
 		$scope.showRegister = false;
		return $location.path('/'); // path not hash
	}

	$scope.logout = function(){
		$scope.state.is_logged = false;
		/*$.ajax({
			url: "/auth/logout",
			type: "GET",
			success: function(data){
				location.href = "index.html"
			}
		})*/

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
		$scope.login(); //Katie
		$http.get('/auth/loggedInUser').success(function(data, status, headers, config) {
        	$scope.logged = data.logged
        	if(data.user){
				$scope.username = data.user.username
			}
        });


	};

    start(); //Init

});






crudApp.controller('profileController', function ($scope, $http, $compile, $routeParams, $location) {
	$scope.user = {
		username: "John Cena",
		imageurl: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxQSEhUUExQUFhUXGBwYGBgXGBcYFxUcGBcYFxQYGBUYHCggGBwlHBUVITEhJSkrLi4uFx8zODMsNygtLisBCgoKDg0OGhAQGiwlHyQsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLP/AABEIAMIBAwMBIgACEQEDEQH/xAAcAAAABwEBAAAAAAAAAAAAAAAAAgMEBQYHAQj/xABIEAABAwEFBQQGBwUGBQUAAAABAAIRAwQFITFBBhJRYXEigZGhEzJSsdHwFUJTYpLB4QcUFiMzQ3KTssLxFyRjgtI0c6Kz4v/EABoBAAMBAQEBAAAAAAAAAAAAAAABAgMEBQb/xAAsEQACAgEDBAAFBAMBAAAAAAAAAQIRAxIhMQQTQVEFFDJSYRUicYGhsfBC/9oADAMBAAIRAxEAPwCym/KH21L8Q8c1w37Q+2p+I8f0We1In1tOH6ZpejTBGLueXnlmuX9KX3Hvd6Povn05R+1Z4+f6Lhv2j9qz57seiory0fW55dMRhmlqYbHrHjl7k/0mP3B3o+i6fTtH7RvmY4aYojr/AKP2g7g4/lj1VLdUaCe0c+GXT81wlvtHPT8uSf6TH7hrNH0XT+IqH2g/C7/xy5oHaOh9p/8AF3/jlzVOG7xPz+S4HNwxd8/kn+kw+4XeX2lwO0tD7Q/hf59nJcO0lAg/zD+B/n2VUntZ97516JClUbxd88UL4Vj+4O8vtNH2V2jp1KopAukzEtMOgE9xVxtUlh3TjGCxzZ47lqpuaDrImM2nX81ol+7W0rLQBPbqHJkgHXF3ADzldGmOKKSfBwdTjnKd1VkLfN4Gi+Km+cJwjXXPPBJ070BAgPjiRHvyKq1+bWurO3oDeyIiJE5ifEKKN6PJA3p0MnLWf16Lzc+KOSdo7MWeOOGlq2Xa0WwSAagbJ1Meaj6trp4TWz4bxjrGSqz7QS4bz8hOpy8x1Sb7TvOEESAcyRhz1OvNQunghrr8i+lItXpKZOFRpwn6w8yM8UhaK26J3XH+7BjnnzyVWa4u3TJbgOvLPAYR8hPLNac8Xk5wI0x4SfLRP5eFmsfimRcpB617GcG1B1jvMT5J3RvQte1wY6d4Zuw59ZXLPXDxLgIx+s3eEST4IV7G2RuFhIxABBmM4x5LphhwWvDCXxLJNNM2LZe2els7X9rEuwJkiHEZ6jgo/a1wYN+J3Wk/oOao+z+3rbIw0qtKp2TI3SN5u9iQWujDGe9NNoP2gNtILWUyyeyS9zTug8AMyeK7NMZbPg8qClHJqQ9pbStgfy395b4dOaPUvQVAIYRI1I8OnNVGz12YerwzGencpOz2lu6I3MBB7Qw/TmvO6vo8eONxPoehayydr/IvXdrAn58kjUqYTDYjGTHiom9b4DMhTJ4b2mpMZDgm9G+mvAwYBHHXmsum6V5Hvwd/UdZjwKr3HlG83Ne7st73Z46nip5u1RaP6bSf/cj/AE5qo1LxZjizEcfelHXlTj1mZcfLNek+gwM8XJ1s5v8AcWl+17sf5bP8T/8AOaJ/F7vs2Z+2fhmqlVvNntM45+XVJ/SjB9Zmc/ol8h05l8y/wW921z/Yp5+07y4Ih2vqezSz+95Y4dFUnXpT9pufii/SjPabn4o+R6cPmn+C2ja+p7NPuLgPCcF1Uw3mzi0oI+R6cn5t/gi3XlXP1j4DTJGF62j2zxyGfFXluwdX2W5cUb+Aavsty4rS5HBq/JQnXjXObznOmfFGbeloGVR2c6Z8VfRsDV4N8Uf/AIfVeDPPlyRcw1fkzz9+r+275zXW220aPdy5TmtFdsC8AyG6cfgmVq2bNOZaM1MsjjyVFSk6jZSP3m0faO4Z+SL+81/bdwz8lbWXTJ9UZqQoXOwfVBOYw8+qwn1iXDPQwfDM03ctkVSwWK01M6jg3AGScuH6K0WC5i0S4yZ1M4DJTFGyRpz/AFRqQ3nRBEAk45ACT8O9cGTPmyPk9vF02HBFtLjlsTa5tD+YfWA7Iwzyk8onrCpl5Xo6q9xc4niSQJ0wnpKldoraX4A4kgAAGRpDQNMctVyyOZSYC6m2pTyJLYJJPaAeDP1QMD9ZdMI6VvufO9X1Us878ENSbUmNx06ANkuJHZH68jwSr6+6SHAgtJwGkHLpKkqu0dODFJrTpDWyMIieHvhQ9a8GPJ7IBnnB4K/6OULWteMjzM8o8k2r2veIJnDAScgI8sFx9MmSAYOQ93mm4YThH6cIOipCY9NqIHZgHTdIjjjGZ5nFL0LbI7QxOOenLDDNRe+/A5QIBAA8ZGPzml/SSOsZTPAkyM/cihWTtOm1wG68aQSHNcHYSTEg5+fFSFgpuABG+KkmWkAB4whzTEgSRicDIxxUfdtmDe1umB2Zlo9YAdouw10lW5t70BTAJDvVcBOAiWzIdE55FvRQ3RVPwQV8XYLa2G0wyo0HdqbhY4wd5wqScRAOus6FUapdb2uLXAggkEcxmtRqWSlVDXMa8NJkOduuDiBkXDHdAEDExPRSlHZ5lsJOT2dkxGIAG6YGREnuIWmOfgKS5MZbd7sEq2wOwEeS2Zv7P2yMXa8ErT2Bbhi7Xh8Fu4yGskVwYoLpcfCUf6GdzylbYzYNuHrZcvgjfwKz72XEfBPSydcDEvoY88kV1zETngtvGwrPvZcf0R3bCU8cDkNUaZC1w9GFOupw0KL9Gu4ard3bB08eydNfND+AaWPZ1Gp8UJMHOPgwoXaeBzQ+jXcCt4GwdL2NeJ+Sjt2Eo+wM+Jw806ZOpGBi7yurfRsHR9gDunzQS0sWpFxFmbwCH7u3holN5d3uqoy3ExZ28EY0BwR5RK1bdBOKLDdshr7tLabXEgmIyjyVCvG8BUJAacT8hTm1d5h280A6A/BVqzWXeOI+fBeb1ORylpifV/Demjjxa5rcJTol2id0LHy+finraQYJgEH54KLtd5AkAN14xPlgsO2o7s7e5LI6jwP/AEWIaGzJ+SnFpuv0VF7jg5wLTAxgwXRxyGCltlbC2CTG9M/POUX9odpApOZMQ0HCJx5ERoutYko6nyeH1vWNt4oceTJW1mip2p7JO9u/Wd94nADAHnHcoy9LW6q4hocGNEAYCY9Zxa3ASZMDLLr20VXOcccCcpgHHgFLXRYQdE26POUbKwaDsxIPLzxXG0T/ALK+OuhpOQRX7OziEu6inhZSWgtjE/7KQslbewOeStx2XaY+efxSjNlgI4jxSc0xrG0Uy3WJzTiJ93kowMIJOPctHtlyl7Q2McpjhxTChsmDjOSanXIPG3wUwEuOMwMY48kf0L/E5aK8M2WaAJxj5CNTuhoOQSeRDWFleuG9TQdi0FpgEH1SBp07lpGxtrDLW0NMscImS71z2cYGpGmUTOZp163bhvABS2yNqksaQ4FhhvvGZy+GSWr/ANClB8Gy7oQDU2/f2e03Fc+kKfttXoHFpY6hCE0F40/bHn8Fz6Tp+2MuB+CA0seQgQmf0nT9rTgfguG9KfteR+CA0sewhCZG9KftHwK4b1p8T4H5hINMh/CEJh9LM4nPh84Ln0sz72fBAaJD9BR/0sz7yCdBpkZt/wASmexXy4jDnniET/iWz7Ot+JuHXHFY76c/JQ9Mp3N9jZB+0ppOFOqOr24cjjj10Stq2qNZp3A8aEF8keGc8Vi7bQRoj1LVP1QO8+HRZZYTkqTo7ekzYcL1TjbL1eF57xILZx9vPjplzSNmv3czY1xy9aJ5HDwKpVO0kaD506IlSuToFlHpqOnJ8Sc93/SLlbL2NXANABM4umeuA7kzFpA0bPGce/mq7TtZAyB6pN9cnQKuwrMpddJxNKu/bo0gJpNcdTv7sxkYjB3vXb9vc2ik2rG76VpG7JPqncnLGQD4rMfSngFdKY/5ezAZ+jBOU9rt/wCryWmTaNHBHdiNKhMKwXWwgYphZqeSlbIMFyyZ0QVMfsCe2cSEzou5J3ZgsjYetYlqTESm1KgpDFDSEJEUeCVZVC64jVAqGFeko6o1S9fLJRdVA0NqjJBCjbADTqA4CDInLrkpZwEqPtjYKuLImhnf+2telXexrmhvZLZYDIdTa8Gf+7DoFHfx7aT/AGjc5/phQu2AJq03z61MA9WOc33bqghvLvjwjjLodvbV9rrPqNz45eSS/jm1fbH8DfHLNVCHc0A13NVQv6LcNt7V9u78LMOMYIh21tX27+UBuHTBVXcdzQ3Hc0UH9FpO2lq+3qZabvgMMkU7YWn7er4j5jkqvuHmhuHmlQizu2ttOP8APrfi0+CIdqbR9vW/GVWiCuQU6Cy0DaWuc69b8ZXFWJK4mO16JQXWUb6LK24bBM4u8kdmwlPmjSxa0Ye26ilhcxW3DYSn97xRxsPT5opjWSK8GJtuPBKC4VtX8FU+B8UYbGU+B8UtL9l9+Pow60XFEqJr2OCRwWw7UbP+ia5zfqxnzIGPis6tVmO+ZgY93eimhWpeBvZbhkYqartgsb7DGsw5NHwVouDZmu+mHH0bQQC1rnNFRwOR3eGIicfJRu2NgFC0ub91hB4jdgHoY8lhk4LTV0kNqTcFI0BATOx056ZKQYw6LmkbxQ7ogk5JelTI1RbOzDEp6ygD1WZYrScnTY4DySTKCXFOEhib6Y4IBvJKtEoxYgBpVOCYlslTDqSa1aSA2Iu0DFMrRT8lKVgD1TV2OCpbCe5UbVdRrFvZJ7TmiBJJkYCMziMuSTtOzL6RaKlJ7CcQHNLZHKVd9nLydSpOMNDxVeWvIHZBAa+BxwiU82fvE2i0inUJc1xIl2PaDS4ETlMEd66o5VaiZKE9Ll4W5ndO5Bh2eK7TuXLs8VuouKn7I8AgLjp+yPALq0r2cvfMMNy/d04Ijrkw9XTgt4Fys4DLgF36GZwGXAI0r2HfMANxHHsnwXfoB2PZPgvQH0Qzhou/RTMcEtP5J7p56qbOP9k+BSZuaAZGq9Fm7GY4fPBUjbi52hoIAmfkJ6fQLJZjNSwCTkgpKtZ+0cs1xBrR6Z8EB3Lngu+CZxnQei5PRc3ui56QcQgA89ECeiJ6QcQh6UcQkFFW2z/pvy094zWZPoMNdgMFpqN3gBIIkSDPEYd5WlbZWhvo39rhkMsRnxWXW62AVAQ6d14JhuQkThqYRKzqxfklvpJ4cX1TLiSZGfiml/VPSNZVBLgGhmJnsiS3uEnxT1lMb8HFrhOOOIwPnHim1sbDyxtMhhaTIMjwXmrZno5FYW5/V71IHCUxu5kNCc2g4J+TLhAfaiMkpRveMCQDx/RNGPbio23Ps2IdVDTyJJ8BilRLbLQy/gM9FJ2K8g8LIrXeTA+Gvc/qCJ8cVL3ZtFuwDPBDgxxmmaabRCL+/ABV+yWt1RoISN7W40xjhPmoo0sk7XtA1uoUXWv0H62M9yqForVKrt1jZPP3ngE3sFqeHANp0XkkDdFQB4JmN5px+rM5CW44harG3wYyyJOmXmjad7He/VOaL5zzVcsV8hx3KlJ1N3CcJHNWGwjs5KWqLQ4/dx2m5NaTrjJJIw1zTzZOyzbKcTgS4jTBjoP+UJu6y/zXPz3iCM8IaAcOoKndiaA/eKrhowjxcw/kU8e80aTenDL+C6hBAIFeieIBCEmawHDxXP3hvEeITHQqUEibU3i3xCKbaz2mfiCAocqn7c/0xlnrorP+/Mx7TPxBVDba8ae7AcwkHiDHhqnwVFbmU1/WPq58UEpWcN44tzQUnXZ6JC7K4uhM4SEv+8HUmktIndJiM49wWZn9pdbV9P8Awzj54R5rRdrBNMj7rsOOGp4LzveDYyJySk/RvCNo0I/tMq/aM/wonzwKI79pdXH+YP8ACHjyPJZX6Y8SuelPEqdyti/3ttfUrjtVCRM4MAx49eSgKduL6sFxPdEc1XxXcNSntxkmrjJw+SmuRp+jT7tph7KLvukZRMdk4Dm1KUrPvvfM7rRDccyZmen5oXdJoUocZbOeY7b8PBwPenZolrmvBlpBa8cCcQfEea4MiqTPRi04L+CHpmCQl6tPeGCQr4PPNPbKVLJog7Tcz6pgv3W98nknFj2Wa1pg9ogiSMRzByCsIs8jDy+KJ+5v+rUc0cgPzCanRDgmVW59l6jKh33t9E4sLmy1wduHewAEie1wz6JzT2aotqGSXAkkNGTROAnPBWWldZ+s5zv7xw8AAEK7A33IllbFDCo8AuOgGSNJwSt82FjyN5sgiMMCNcDolLAO1CcW6nqs7dmtKiu2ChSpvcdzdnSBHDNNrNcdmZV9I046AloiMvVEmMNdFY/Qh3VKfuQ4Aq1ka4IeNN20RrLKw/VB7kpubqfikGpnWcpuy0qF9+A3nPgM/epzYhvbrOjPd8y6P8qr1Gqco0IB4cVati6fZqn7zW/haT/rW2FfvRn1Eqwtf9yWOESsOyUcBEr5HJd6PKMp25vR9Ot2WtI3czPEyOnxVPqbVvaY3Kfn4dFeNtKG8+ez6uvUrJ77Zu1CES5OhKkTn8XP9il5+B5JN21tT2aeXA+fFVbe6IpcoAtjdsaoyFLLUH44nmkau0jqnrFg4QDHzzVYLiilyKsRNvvXH1h4LqgpQRQ9TPYMoArniujvVnMV7anFkY5H5PJYNe9DsnPJb3tN6uuvTvWK33S7Bwdkc8hzSZ1Y+CioLpRUiQFSWz7ZrDoo1SWz/wDWHTXuTQLk026d4sIAd2e3jnBDQ7DlDT4pxUqsiS7PQaobLD+ZkfV1OOY81er0u6iyyWioyjTY91B4Lw1od2mEGSBzxWM8Kl+6zoWfT+1ozK1EEgtMg4g8QcQnNmqYJjQoblMNmd3LTVL0TiuNnSTVmtBHRSVN8qDpGE9oWhSNEnUqBoknLNQ7LUKhLgDu5gnUcU0vG2Gq8Ux6oxfzGg8Ub99p059I4NHEkAR10QkNkvY+Kf12khQVkvynPZIcOIMjxCknX23iOiTQkxCpULQSBlpxS13Xkyo3A/pxUa+9mkxmcuQ70ztdE0qoqN9V+Dhz0PePchoaZN2tyj3OSlaoYBSRp5SmgZN3fs7UrU2VadRgkua5r5gAOI3mkA44ZHxCud2WIUababTMZnVxOZPzkAo/Y902VnJz/wDOT+amvBehiilFM8vPkk24t7JnfBJ1sjklEnWyOS1MTOdrXw/NuWo56clkW0Tv5p6cFru1vr56HMSM9Fke0giqeiH5OjwiIJXCUJXCoECUUldK4gDkoIQggD2Ce9dHeuELoCs5yB2kbLddenesdvyn2DgcjmcOoWy7RN7OXHPLvWM323sHDQ4k4eHFDOrFwZ6uELpQUknIUjs//WHTXJR6kdnv64yyTQeTVdlxFTKOzqeYWh31/wChr4f2Lv8ALis82aZFQYAdnjOoWi3oybFXH/Qf/wDWUPgc/qX8mVFcpjFGaOz0SW/BXmnoMeOqwEpTqEtJCSe2QE7s7IEKRiN2Ut0FxzcZ6D6vzzQtdjFQ68JSz6sGMFx9406eL3Ae/wAFS2DnYia+zJneZuh3EDdd5Zo9kud28CZni4+4BL1NsaAMNaXdMfcEd207N3ebReRGow/VFsNKXkdULuDMcynNYB7C0/7HQ+KhWbZUid1zC3xHkQpOnbqbxLXDocCkPjgFMS2Dm04j50S9RuAXadMHHWEKvqJAXHYl3/LHlUd7mn81PqC2LpxZQfae8+Dtz/Qp0lelj+lHk5frZ2USqcCjItXIqzMz7ak9oYkYHGJGayDaj+rrkti2o9YYuGBxAnXgsg2qEVdctUM6PBAoR1RvFc8VAgviueKMe9cQAUhBG8UEAevl0LkLoCo5yG2hb2fisbvtnZOAGeM/lxWy7QDs6fDDhqsYvrI4N1xnHw4pnRi4M8KKjFcUgBSOzp/nt7/mFHgYganAAZk6ADUq+bFfs+tlSo2rVpus9EfWqCKjp0ZSPa73ADrkmvZLkkW3ZekXVQGhs7umMYjM6BXK/bfuUnUBG++k+futDDvHmk7TXo3fQ7LQPZbOLjxcdevcNAqdsVXfbrRa7S8l1NlM0uTn1i2QD91jT+JqiTvgWu3Y0pN0Oqa12QVM2ywFhLdRkdHDQ/Oqj3tkwc/mF5/DPT5VhbM+BCf2U7wUZTO6fen1hIa+PquxHwQwQytl3VHv/qlg4gA+UhRtt2Ve+P5xmRvYSHicY1B8VbLbZ4OGRTWnULc8k4yKpHbvuay0hIJJAwDmmZ1Hq45DWFLOfR3C3EiIwa4EznjHwTD6RDdJ6JCpffClUPcI98J2T2oef9gvG67PV3g2ziS5jvSEHfhg9XecS6DjIwnVJm5qOrG8jj5cO5KU73c7+zcOqUFTeMlDkWlFKkKUGhjS0EmBqhajDQNUuWBoaDmTj7ymVd5qP7OM4N5/JUIlmgbLWxrrPTaDiwbrhqI4qZlZffN31LstRr06pdRcWy0jFhIAdjMFpLSYjDRX26LzbXYHsyOY1C74ycaTPJnTbkiURamWqDXIVDgtUyChbUesPWyOIzz4LH9rB/NyOXFbFtOzEYO1yOPese2uZFUYafnrzVNHT4IFFK6G8iuEclmI4uFBcQAIQQXEwPYPgjIvgujuVHORF/nsaZ+GCxq+8j6ubv73TmtnvxhLQBnOgJOWgGZVDOwlor+u6nRaScXDefBOEMafeQg3xzUVuYhuyYGJJgAYkknAAalaZsh+yWpVAq25zqLDiKLY9MR99xkU+kF2P1SrzszsLZLA70rN6rWyFSqQS2c/RsAAZ1xdzVka4nVQ5LwYym2IXLcFjsQizUKdMxBdE1HdajpcfFLWq1NEuc6GtEknIAZ9UlagQMJ1yEqlbRXo51MBrT6N5MPcCPSBue40R2ZIgzjGUQTDbYkhtbWvvG0GSPQsMOEn1c2sEanMmRh3K63ZZm0bM2m0NaC4mGgNGcDsjk0KD2foblNlP60Y/ec7F7j3z3AKeqHEcp/zE/mpsvyI2+wCq3gRkeCqVusRmMnDz/RXqkm143cKg56EZjp8FnOGo6MWbRs+DPHCeR1RQ4gR3jkVM3ldhbmI0Dxl38OhUOXQd12B8j0WDTXJ2WnuiasFrDmgOxCcOsHDJV2m8tMqasN6iIKlxBTFm2FuoSv7g3gjCsHYg/PRIVrQ4ZER5+CNyrQo6yjKEs2g1rZjn8E3beLdT7k1tN4b+DemGfRGmxOXoRtdeThlkpu4Lr3R6R4xPqjgOPUjy6oXNcZkPqjmGcObvh48FYwxbwh5ZzZcu1IabS2ZtTda8S17HMd/mb3jEql7NW91krus7ndkGO1kR9QjnkO9Xq8XbwZ90+8R+apO1Vx1H1WV6YEbpbUkjL6ufU+AW3JxrY0Sx2wPEgg9DOOqc+kVNua0B9PfpktdMOEyN4RMtyxw4HLFTVhvYOO4/su0Byfx3DhvdIB5JJktDq8bopV/WBB4tMHv0Ko+0P7NX1Xb1GrTP3XgtP4hI9y0MFCCtVNoFJrgwm37FWmhjUoPgTLmjfb13mSAOsKvWmyCMIXphtWNcUxvS4rLaf69ClUPtFsP7qjYcPFV3E+TZZ35R5frWczgEg+mRmFvlv8A2WWYmaNSpS4NcBUaOhwd4kqoX7+yy1tB9EKdb+48NP4ake8oF3IszBcVmfsDeQMfuVbuDT5hyCdBrj7PTaBKIXptaLUG5YlQ5GAu+pCbPfKQFSc9Uc4+qpuwEqqZWy820oBBc92DWtBc55jIR7zAGZwTC/rxLJawjfiTMQwaOcTkDGA1KrFkp1LQ4spE9vCpWI7VSJwkeqzD1RymUh17LabWax3TuOOrAd6kw/8AUf8A2hHs4N/vYFVdtobaLcXOcajWDNxmQzAEAYNBeZAGgU1fr/3ezeipEh7huAjPLHphPeQqpswwuNV4ykMb0bn1xKTKii+WRzC4FrcsZ8gnbhMqEuysWuywOHfopxrsRIIUlUGpBLtKKGIwCYgVKLXZhV6+tladQS2WnkP9PwhWMI6Gkxxk48GSXjddaiYxc05FoLvICQq7aLxeD2d10ey4SOMgwtY2yeKFB1Xd3nEhrGCZe93qiACcILjAODSVkVG1VXu3qj2vl04tpkSXOjdgGcBAALuUpLHZ0LK3ygo2kqNMEVAeBbPuKmbBb61UDAgnLDE/9uagq1ipvlxaA77sMAIa2ey2GyC4YYkat0OxbJ22nXo9ljKdRh3ajGANgyd127AIDgCYIBwIjBKWNIfcaK7d2zdapBfLRxfh4MGPjCtt2XTTo+qJd7Rz7vZ7k/3IR2NSUaMpZGwzWoxStOmlAxXRlYwrUJBlQdsO+1zYkEEeIhT1tBcCBOcRxUXXpuE7rThgTGA70ikZ9slerrPWNJ5O7vbjpPOGux4HyKuNttENOEjymcP91VNpLgqmq60yxrGiXCXFzhEOhoEZakqTuW8vTUjTeZeAe0frYYHmYATYnuTN3bTbhAcS5vTtj/zHn1xKstO3te0Oa4EHIgyCslvOi6m8+Ud/glrrvKrSJO9LTiWmceY4H4JcBSZp1W2jI/BEF6bkSQW9clVmXm17Z3zjkTh3YDEppWvFzSWkDqTPzMIFRfheAgEGQdRqg28AdVm1O/H03nEubqzMHkOB4HMKVfbwAHNcdxxwOrTqx3B3kRii2GkuwtvMIKkC9hqB5oJ2xaS91jj3fkoiicR3fmggmSK2g4O+dVFXraHtPZc4YOyJGqCCTKhyVW+Kh3KOJ7Qc52PrO9I4bx4mABPIK17K0wKDSAASMSBBPUoIKvApEXtQf+Yp9HfkmOxo/wCUpdPyCCCkteCxUcx3KXtp/lu6FBBIoehBBBUQwLoQQSAqG3zA6rZ2uALfR1DunET6WziYOEwSFm9XtUKDji59Sm17jiXte6tvtccyDAkHOFxBax4NY/Shgx5AJBM+nqs/7GCnuM/ut0GQV52GcW3nVptMUxZ3EMGDARXaAQ0YTGCCCU+C3waInDF1BZGDHAXSggqIGDTkjFBBSaFZvb+lU/uO/wApVK2fMCnHD/SuIJ+AJW/8x86qInE9AgggSHNleQ4wSMRlhx+ARreZLZx69Cggl5ASPz5I10OJbagSSPQuMHKWlu6eokwUEExvgXLjhich7kEEEAf/2Q==",
		email: "mynameisjohncena@johncena.com",
		description: "You're reading the description of someone, and his name is John Cena.",
		age: 38,
		gender: 'male',
		interests: [{name: "Wrestling"}, {name: "Vine"}, {name: "Memes"}]
	};

	$scope.posts = [{text: "Example post. Ideally style and structure for posts from other parts of the site can be used here to see all posts of a user."}]

	$scope.groups =[{name: "Wrestling Fans", description: "A group for lovers of Wrestling"},
					{name: "Meme Central", description: "All your favourite memes in one place"}]


	$scope.setUser = function(username){
		$http.get('/users/profile?username='+username)
		.success(function(data, status, headers, config){
			console.log(data)
			$scope.user = data
		}).error(function(data, status, headers, config){
			$location.path("login")
		})

		$http.get('/users/hasEditPermission?username='+username)
		.success(function(data, status, headers, config){
			$scope.hasEditPermission = data.hasEditPermission
		}).error(function(data, status, headers, config){
			$location.path("login")
			$scope.hasEditPermission = false
		})
	}

	$scope.isEmpty = function(list){
		return list.length == 0
	}

	$scope.enterEditMode = function(){
		if(!$scope.hasEditPermission){
			return
		}

		editModeReplace($("#description"), "textarea", "style='width: 100%;' placeholder='Description'")

		$("#edit-button").replaceWith($compile("<button class='btn btn-success' ng-click='test()'>Save Changes</button>")($scope))
		$("#buttons").append($compile("<button class='btn btn-primary' ng-click='test()'>Change Password</button>")($scope))
		$("#buttons").append($compile("<button class='btn btn-primary' ng-click='test()'>Upload Profile Image</button>")($scope))
	}

	$scope.test = function(){
		alert("Test")
	}

	if(angular.equals({}, $routeParams)){
		$http.get("/auth/loggedInUser")
		.success(function(data, status, headers, config){
			if(!data.user){
				$location.path("/")
			}else{
				$scope.setUser(data.user.username)
			}
		}).error(function(data, status, headers, config){
			$location.path("/")
		})
	}else{
		$scope.setUser($routeParams.username)
	}
});

function editModeReplace(el, type, attrs){
	if(type == "input"){
		var value = el.html()
		el.replaceWith("<"+type+" value='"+value+"' "+attrs+">")
	}else{
		var value = el.html()
		el.replaceWith("<"+type+' '+attrs+">"+value+"</"+type+">")
	}
}

crudApp.directive("ngGroup", function(){
	return function(scope, element, attrs){
		angular.element(element).hover(function(){
			//$(this).stop(true, true)
			$(this).find(".group-description").stop(true)
			$(this).find(".group-description").show('fast')
		}, function(){
			$(this).find(".group-description").stop(true)
			$(this).find(".group-description").hide('fast')
		})
	}
})



crudApp.controller('feedController', function($scope, $location, $http, sharedService) {


 $scope.search_tag = '';

 $scope.Groups = [
      {_id: "1", name: "Etobicoke", description :""},
      {_id: "565b5911afaf8bac32029661" , name: "Toronto", description :""},
      {_id: "3", name: "UofT", description :""},
      {_id: "4", name: "a new group", description :""},
      {_id: "65b5911afaf8bac32029672", name: "Announcement", description :""}
    ];	
     
    
    	
    		 $scope.Interests = [
      {_id: "aaaa", name: "fishing"},
      {_id: "bbbb" , name: "cats"},
      {_id: "cccc", name: "dogs"},
      {_id: "dddd", name: "real estate"},
      {_id: "565b5911afaf8bac3202966c", name: "Food"}
    ];	
    


/*
group: "5660cdaa20bcd1782ec2225e"
Missing: groupname - Etobioke ---- we just jave groupid
avatarURL : "https://www.gravatar.com/avatar/89e0e971f58af7f776b880d41e2dde43?size=50", 
where is interest???
On group search: should fill in description, name
Also, should smartly recommend the "Add myself to this group based on whether they're in the group"
*/




  $scope.Posts = [
     {_id: "aaaa5", 
      username: "Chris" ,
      short_text: 'hey',
       userid: {
       	imageurl: "https://www.gravatar.com/avatar/89e0e971f58af7f776b880d41e2dde43?size=50" },
      date_posted: 'Sun Nov 29 2015 14:59:13 GMT-0500 (Eastern Standard Time)',
      
      interestname : 'Cooking',
      groupname: 'Toronto', 
      averagerating: 3.5,
       hashtags: ['great', 'cool', 'iheartmyTO']} , 
        {_id: "aaaa6", 
      username: "Adam", 
      userid: {
       	imageurl: "https://i1.wp.com/slack.global.ssl.fastly.net/3654/img/avatars/ava_0001-72.png?ssl=1" },
      date_posted: 'Sun Nov 29 2015 14:59:13 GMT-0500 (Eastern Standard Time)',
      short_text: 'hello!',
      interestname : 'CS',
      groupname: 'Etobicoke', 
      averagerating: 5,
       hashtags: ['wellthatwasfun', 'iheartmyTO']},
      {_id: "aaaa7", 
      username: "Jim", 
      userid: {
       	imageurl: "https://avatars.slack-edge.com/2015-11-18/14843332005_64782944e2c667c5e73f_72.jpg" },
      date_posted: 'Sun Nov 29 2015 14:59:13 GMT-0500 (Eastern Standard Time)',
      short_text: 'hello world!',
      interestname : 'Toronto',
      groupname: 'SadUniLife', 
      averagerating: 4.5,
       hashtags: ['wellthatwasfun', 'wholetthedogsoutwhowhowho']},
      {_id: "aaaa8", 
      username: "Katie", 
      userid: {
       	imageurl: "https://secure.gravatar.com/avatar/524e5d5e8c92b9dcf1ad7f6bd582eb3c.jpg" },
      date_posted: 'Sun Nov 29 2015 14:59:13 GMT-0500 (Eastern Standard Time)',
      short_text: 'Want Christmas and kittens!',
      interestname : 'Etobicoke',
      groupname: 'EvenSaddderUniLife', 
      averagerating: 4.5,
       hashtags: ['adeleonstage', 'lanaisofftotheraces']} 
    ];
   
   $scope.showHero = true;


     
   





 $scope.getUserProfile = function(user_name) {
 	alert(($scope.state.is_searching | $scope.state.is_showing_interest));
 	alert(user_name);
}

 $scope.getPostbyID = function(post_id) {
 alert(post_id);
} 

 $scope.createNewPost = function(post_type) {
 alert(post_type);
}


/*var getGroupByID = function(group){  YES
GET /groups/group

var searchByGroup = function (group) YES DONE2
GET /groups/group/posts

var getPostsByInterest = function(interest){  YES DONE2
GET /interests/interest/posts

var hashTagIndex = function(){ YES
GET /tags

var searchByTagname = function (tagname) YES DONE2
GET /tags/tag/posts

var mainFeed = function(){ YES
GET /dashboard


var getAllGroups = function(){ NOT DONE YET
GET /groups 

*/

 var getPostsByInterest = function(interest_id) {
	 $http({
	  		method: 'GET',
	        url: '/interests/interest/posts', //get all user emails & displayname
	        params: {id: interest_id}
	    })
	  	.then(function successCallback(response) {
	  		console.log(response);
  			$scope.Posts = response.data.posts;
  			$scope.search_tag = response.data.interest;


	    },
	    function errorCallback(response) {
	    	console.log(response);

	    });
 };

  var getMainFeedPosts = function() {
	$http({
  		method: 'GET',
        url: '/dashboard', //get all user emails & displayname
    })
  	.then(function successCallback(response) {
  		console.log(response);

    },
    function errorCallback(response) {
    	console.log(response);

    });
  };

  var getTagIndex = function() {
  	$http({
  		method: 'GET',
        url: '/tags', //get all user emails & displayname
    })
  	.then(function successCallback(response) {
  		console.log(response);

    },
    function errorCallback(response) {
    	console.log(response);

    });
  };

	var getPostsByHashTag = function() {
		$http({
	  		method: 'GET',
	        url: '/tags/tag/posts', //get all user emails & displayname
	        params: {tagname: 'Cool'}
	    })
	  	.then(function successCallback(response) {
	  		console.log(response);
	  		//$scope.search_tag = response.data.interest;

	    },
	    function errorCallback(response) {
	    	console.log(response);

	    });
	};



var getGroupByID = function(group_id){
	$http({
  		method: 'GET',
        url: '/groups/group', //get all user emails & displayname
        params: {_id: group_id}
    })
  	.then(function successCallback(response) {
  		console.log(response);
  		$scope.group = response.data.group;
  		$scope.is_group_member = response.data.is_member;
  		/*
_id: "5660faa0419858a825a6533f"
description: "Groups - I assume we will preload some groups. How does the user belong to a group? Can they choose any group to join? Are there public and private groups? Will the user only see posts for the groups that they are registered with? Right now, I have set it so that all groups are by default public, and I was thinking that if a group is private then users already in the group have the privilege to add others. search and rate things in neighbourhood Toronto overall. Does this mean search and rate posts in the group the user belongs to? Site events? Page views I understand, but what else goes into this? Post expiry date - why do we need it? What happens to the post after expiry? I am concerned because there are tuples in other tables that depend on the post, and reputation of the user is aggregated based on ratings on their posts, so we shouldn’t remove the posts. How to calculate the user’s reputation? Example: there could be 1 post with a five star rating made by one user. On the other hand, there could be a post where 100 users voted. Also, some users have only a few posts, while others have multiple. So I was thinking what if we will create some formula based on numbers of posts and 5, 4, … 1 rating counts, number of votes."
group_creator: "5660faa0419858a825a6534b"
name: "Toronto"
private_type: false
__proto__: Object

is_member: false
  		*/

    },
    function errorCallback(response) {
    	console.log(response);

    });
};

var getGroupPosts = function(group_id){
	$http({
  		method: 'GET',
        url: '/groups/group/posts', //get all user emails & displayname
        params: {groupid: group_id}
    })
  	.then(function successCallback(response) {
  		var reformattedPosts = response.data.posts.map(function(post){ 
   			var post = post;
   			post.group = {
   				_id: post.group,
   				name: response.data.groupname
   			};
   			return post;
		});
  		$scope.Posts = reformattedPosts;
  		console.log(reformattedPosts);


    },
    function errorCallback(response) {
    	console.log(response);

    });
};


  var fullGroupList = function(){
  	$http.get('/groups').success(function(data, status, headers, config) {
  		console.log(data);  
    });
  };

 var testScope = function(){

 	$scope.state.is_group_page = true;
 	$scope.$emit('update_test');
 }

 var populateFeed = function (){
 	

    
 }





//$scope.state.is_searching

	
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

  var start = function(){
  	console.log('START ' + $scope.state + ' ');
  	console.log($scope.state);
  	if ($scope.state.is_group_page){
  		var groupid = (sharedService.getData()).groupid;
  		getGroupPosts(groupid);
  		getGroupByID(groupid);

  	} else if ($scope.state.is_showing_interest){
  		var interestid = (sharedService.getData()).interestid;
  		getPostsByInterest(interestid);
  	} else if ($scope.state.main_dashboard){
  		//getMainFeedPosts();
  	}
  	fullGroupList();
 

  };



  start();

});







crudApp.controller('groupController', function ($scope, $http, $location) {

	$scope.showMsg = false;

	$http({
		method:'GET',
		url: '/groups'
	}).then(function successCallback(res) {
		$scope.groupList = res.data.groups;

	}, function errorCallback(res) {
		console.log(res.data.error);
	});

	$scope.addGroup = function () {
		$location.path('/createGroup');
	};

	$scope.deleteGroup = function (id) {
		$http({
			method: 'DELETE',
			url: '/groups/group/' + id
		}).then(function successCallback(res) {
			for (var i = 0; i < $scope.groupList.length; i++) {
	 			if ($scope.groupList[i].name == name) {
	 				$scope.groupList.splice(i, 1);
	 			}
				$scope.showMsg = true;
				$scope.msg = res.data.message;
				$timeout(function() {
					$scope.showMsg = false;
				}, 3000);
			}
		}, function errorCallback(res) {
			$scope.showMsg = true;
			$scope.msg = res.data.error;
			$timeout(function() {
				$scope.showMsg = false;
			}, 3000);
		});
	};
});


crudApp.controller('interestController', function ($scope, $http, $location) {

	$scope.showMsg = false;

	$http({
		method:'GET',
		url: '/interests'
	}).then(function successCallback(res) {
		$scope.interestList = res.data.interests;

	}, function errorCallback(res) {
		console.log(res.data.error);
	});

	$scope.submit = function () {
		if ($scope.interest == undefined) {
			$scope.showMsg = true;
			$scope.msg = "Please fill the blank";
			$timeout(function() {
				$scope.showMsg = false;
			}, 3000);
		} else {
			$http({
				method: 'POST',
				url: '/interests/addnew'
			}).then(function successCallback(res) {
				$scope.showMsg = true;
				$scope.msg = res.data.message;
				$timeout(function() {
					$scope.showMsg = false;
				}, 3000);
			}, function errorCallback(res) {
				$scope.showMsg = true;
				$scope.msg = res.data.error;
				$timeout(function() {
					$scope.showMsg = false;
				}, 3000);
			});
		}
	};

	$scope.deleteInterest = function (name) {
		$http({
			method: 'DELETE',
			url: '/interests/interest/name'
		}).then(function successCallback(res) {
			for (var i = 0; i < $scope.interestList.length; i++) {
	 			if ($scope.interestList[i].name == name) {
	 				$scope.interestList.splice(i, 1);
	 			}
				$scope.showMsg = true;
				$scope.msg = res.data.message;
				$timeout(function() {
					$scope.showMsg = false;
				}, 3000);
			}
		}, function errorCallback(res) {
			$scope.showMsg = true;
			$scope.msg = res.data.error;
			$timeout(function() {
				$scope.showMsg = false;
			}, 3000);
		});
	};

});


crudApp.controller('postController', function ($scope, $http, $location) {

	$scope.showMsg = false;

	$http({
		method:'GET',
		url: '/posts'
	}).then(function successCallback(res) {
		$scope.postList = res.data.posts;

	}, function errorCallback(res) {
		console.log(res.data.error);
	});

	$scope.getPost = function (id) {
		$location.path('/post/' + id);
	 };

	$scope.deletePost = function (id) {
		$http({
	 		method: 'DELETE',
	 		url: '/posts/posts/' + id
	 	}).then(function successCallback(res) {
 			for (var i = 0; i < $scope.postList.length; i++) {
	 			if ($scope.postList[i].id == id) {
	 				$scope.postList.splice(i, 1);
	 			}
 			};
 			$scope.showMsg = true;
			$scope.msg = res.data.message;
			$timeout(function() {
				$scope.showMsg = false;
			}, 3000);


	 	}, function errorCallback(res) {
	 		$scope.showMsg = true;
			$scope.msg = res.data.error;
			$timeout(function() {
				$scope.showMsg = false;
			}, 3000);
	 	});
	};

});


crudApp.controller('userController', function ($scope, $http, $location) {

		// $scope.userList =
	 // 			[{email: 'hello@fromtheotherside.com',
		// 		  password: 'dddd',
		// 		  accounttype: 2, //0 for Super Admin, 1 for Admin, 2 for user
		// 		  loggedin: 0,
		// 		  username: 'Adele',
		// 		  description: '25 now',
		// 		  //validation between 10 and 200 (vampires!)
		// 		  age: 25,
		// 		  gender: 'female', //for aliens!
		// 		  homeaddress: 'London',
		// 		  workplace: 'Some label',
		// 		  position: 'Songstress',
		// 		  contactinfo: 'Forget it',
		// 		  interests: [0, 2]},

		// 		  {email: 'borntodie@lana.com',
		// 		  password: 'dddd',
		// 		  accounttype: 1, //0 for Super Admin, 1 for Admin, 2 for user
		// 		  loggedin: 0,
		// 		  username: 'LanaDelRey',
		// 		  description: 'Off to the races!',
		// 		  //validation between 10 and 200 (vampires!)
		// 		  age: 25,
		// 		  gender: 'female', //for aliens!
		// 		  homeaddress: 'USA',
		// 		  workplace: 'Some label',
		// 		  position: 'Songstress',
		// 		  contactinfo: 'Forget it',
		// 		  interests: [0, 2]
		// 		}];

	$http({
		method:'GET',
		url: '/users'
	}).then(function successCallback(res) {
		$scope.userList = res.data.users;

	}, function errorCallback(res) {
		console.log(res.data.error);
	});

	 $scope.getUser = function (email) {
	 	$location.path('/userProfile/' + email);
	 };


	 $scope.delteUser = function (id) {
	 	$http({
	 		method: 'DELETE',
	 		url: '/users/profile/' + id
	 	}).then(function successCallback(res) {
 			for (var i = 0; i < $scope.userList.length; i++) {
	 			if ($scope.userList[i].id == id) {
	 				$scope.userList.splice(i, 1);
	 			}
 			};
 			$scope.showMsg = true;
			$scope.msg = res.data.message;
			$timeout(function() {
				$scope.showMsg = false;
			}, 3000);


	 	}, function errorCallback(res) {
	 		$scope.showMsg = true;
			$scope.msg = res.data.error;
			$timeout(function() {
				$scope.showMsg = false;
			}, 3000);
	 	});
	 };
});


