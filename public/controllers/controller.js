// create the module
var crudApp = angular.module('crudApp', ['ngRoute', 'ngMaterial']);

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
			$("#signin_popup").modal('hide')
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
		/*$.ajax({
			url: "/auth/logout",
			type: "GET",
			success: function(data){
				location.href = "index.html"
			}
		})*/

		$http.get('/auth/logout').success(function(data, status, headers, config) {
        	$location.path('login')
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

		$http.get('/auth/loggedInUser').success(function(data, status, headers, config) {
        	$scope.logged = data.logged
        	if(data.user){
				$scope.username = data.user.username
			}
        })


	};

    start(); //Init

});

crudApp.factory('profileService', function(){
	var userStore = {}

	userStore.user = null

	userStore.setUser = function(user){
		this.user = user
	}

	return userStore
})


crudApp.controller('profileController', function (profileService, $scope, $http, $compile, $routeParams, $location) {
	$scope.user = {
		_id: "1234",
		username: "John Cena",
		imageurl: "/images/cool_cat.png",
		email: "mynameisjohncena@johncena.com",
		description: "You're reading the description of someone, and his name is John Cena.",
		age: 38,
		gender: 'male',
		interests: [{name: "Wrestling"}, {name: "Vine"}, {name: "Memes"}]
	}

	$scope.posts = [{text: "Example post. Ideally style and structure for posts from other parts of the site can be used here to see all posts of a user."}]

	$scope.groups =[{name: "Wrestling Fans", description: "A group for lovers of Wrestling"},
					{name: "Meme Central", description: "All your favourite memes in one place"}]

	$scope.editing = false

	$scope.edits = {
		newDescription: ''
	}

	/* Interest control for md-autocomplete */
	$scope.interestCtrl = {}

	$scope.interestCtrl.searchTextChange = function (text) {
		this.showSubmit = false
	}

	$scope.interestCtrl.selectedItemChange = function (item) {
		this.showSubmit = true
	}

	$scope.interestCtrl.querySearch = function (query) {
		return $http.get("/interests").then(function (result) {
			var interests = result.data.map( function (interest) {
				interest.value = interest.name.toLowerCase();
				return interest;
			});
			return interests.filter($scope.interestCtrl.createFilterFor(query))
		})
	}

	$scope.interestCtrl.createFilterFor = function (query) {
		var lowercaseQuery = angular.lowercase(query);
		return function filterFn(item) {
			return (item.value.indexOf(lowercaseQuery) === 0) && $scope.user
			.interests.filter(function (x) {
				return x._id == item._id
			}).length == 0;
		};
	}

	$scope.interestCtrl.interestText = ''
	$scope.interestCtrl.selectedInterest = null
	$scope.showSubmit = false

	$scope.interestCtrl.addNewInterest = function () {
		if(!this.selectedInterest){
			return
		}
		$scope.saveEdits({interests: $scope.user.interests.concat([this.selectedInterest])}, function () {
			$scope.interestCtrl.selectedInterest = null
			$scope.interestCtrl.interestText = ''
			$scope.interestCtrl.showSubmit = false
		})
	}

	/* End Interest Control */

	$scope.setUser = function(username){
		$http.get('/users/profile?username='+username)
		.success(function(data, status, headers, config){
			console.log(data)
			$scope.user = data
			profileService.setUser($scope.user)

			$http.get('/users/user/group?id='+data.id)
			.success(function(data, status, headers, config){
				$scope.groups = data.data
			}).error(function(data, status, headers, config){
				$scope.groups = []
			})
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

	$scope.dismissChanges = function () {
		$scope.editing = false
		$scope.edits = {}
	}

	$scope.isEmpty = function(list){
		return list.length == 0
	}

	$scope.enterEditMode = function(){
		if(!$scope.hasEditPermission){
			return
		}
		$scope.editing = true
	}

	$scope.test = function(){
		alert("Test")
	}

	$scope.saveEdits = function(edits, complete){
		for(property in edits){
			this.user[property] = edits[property]
		}

		$http.put("/users/profile", {user: this.user})
		.success(function(data, status, headers, config){
			console.log("Saved changes")
			complete()
			profileService.setUser(this.user)
		}).error(function(data, status, headers, config){
			console.log("Failed to save changes")
		})
	}

	$scope.saveChanges = function () {
		this.saveEdits(this.edits, function () {
			$scope.editing = false
			$scope.edits = {}
		})
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
})

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

crudApp.controller('profilePasswordController', function(profileService, $scope, $http){
	$scope.passwordChange = {
		old: '',
		new1: '',
		new2: ''
	}

	$scope.error = ''

	$scope.resetError = function(){
		$scope.error = ''
	}

	$scope.resetPasswords = function(){
		$scope.passwordChange = {
			old: '',
			new1: '',
			new2: ''
		}
	}

	$scope.changePassword = function(){
		if(!profileService.user){
			return alert("No user!")
		}

		if(!this.passwordChange.old){
			return this.error = "Old password can't be empty!"

		}else if(!this.passwordChange.new1){
			return this.error = "New password can't be empty!"

		}else if(!this.passwordChange.new2){
			return this.error = "Confirm password can't be empty!"

		}else if(this.passwordChange.new1 != this.passwordChange.new2){
			return this.error = "New password doesn't match confirmed password!"
		}

		$http.put("/users/profile/passwordchange", {_id: profileService.user._id,
													new_password: this.passwordChange.new1,
													old_password: this.passwordChange.old})
		.success(function(data, status, headers, config){
			$("#password-modal").modal('hide')
		}).error(function(data, status, headers, config){
			$scope.error = data.error
		})
	}
})

crudApp.controller('profileImageController', function(profileService, $scope, $http){
	$scope.imageChange = {
		file: null
	}

	$scope.error = ''

	$scope.resetError = function(){
		$scope.error = ''
	}

	$scope.resetImage = function(){
		$scope.imageChange = {
			file: null
		}
	}

	$scope.changeImage = function(){
		$scope.resetError()
		if(!profileService.user){
			return alert("No user!")
		}

		var file = document.getElementById("new_image").files[0]
		console.log(file)

		if(!file){
			return $scope.error = "You must choose a file!"

		}

		var reader = new FileReader();
		reader.onload = function(){
			$http.post("/users/fileupload", {_id: profileService.user._id,
											file: reader.result})
			.success(function(data, status, headers, config){
				$("#image-upload-modal").modal('hide')
				profileService.user.imageurl = data.newURL
				//$("#profile-img").attr('src', data.newURL)
			}).error(function(data, status, headers, config){
				$scope.error = data.error
			})
		}
		reader.readAsDataURL(file)
	}
})

crudApp.controller('feedController', function($scope, $location, $http) {
 /*

1. Dashboard
		- populate the main feed (different methods)
		- populate the side bar for the user
		- populate interests, groups
		- populate name, admin/not admin
>>>>>>> origin/chris

 */


 var populateInterests = function(){

 	/*$http.get('/users/profile', ).success(function(data, status, headers, config) {
        	console.log(data);
    });*/
    $http({
    		method: 'GET',
          url: '/users/profile', //get all user emails & displayname
          //params: {email: (sharedService.getData()).email}
      })
    	.then(function successCallback(response) {
    		$scope.data.email = response.data.email;
    		$scope.data.display_name = response.data.displayname;
    		$scope.data.description = response.data.description;
    		$scope.data.user_logo = response.data.imageurl;
    		if (response.data.accounttype < 2){
    			$scope.data.profile_is_admin = true;
    		}
    	},
    	function errorCallback(response) {
    		console.log("Failure");
    		console.log(response);
    	});
 };



 var start = function (){
 	//populateInterests();
 }

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



  start();

});


//////////////////////////////////
//Added by Jim

crudApp.config(function ($routeProvider, $locationProvider) {
	$routeProvider.when('/', {
		templateUrl: '/dashboard.html',
		controller: 'userController'
	});
	$routeProvider.when('/userList', {
		templateUrl: '/userList.html',
		controller: 'userController'
	});
	$routeProvider.when('/postList', {
		templateUrl: '/postList.html',
		controller: 'postController'
	});
	$routeProvider.when('/interestList', {
		templateUrl: '/interestList.html',
		controller: 'interestController'
	});
	$routeProvider.when('/groupList', {
		templateUrl: '/groupList.html',
		controller: 'groupController'
	});
	$routeProvider.otherwise({redirectTo: '/'});

	$locationProvider.html5Mode({enabled: true,requireBase: false});
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
