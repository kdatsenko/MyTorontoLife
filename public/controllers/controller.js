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
		 .when('/', {
      	templateUrl : 'pages/feed.html',
      	controller  : 'dashboardController'
     })
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
			.when('/profile/:username', {
      	templateUrl : 'pages/profile.html',
      	controller  : 'profileController'
      })

			.when('/profile/interests', {
      	templateUrl : 'pages/customizeInterests.html',
      	controller  : 'interestsController'
      })

			.when('/permalink/:post_id', {
      	templateUrl : 'pages/postpermalink.html',
      	controller  : 'permalinkController'
      })
			.when('/tags', {
				templateUrl : 'pages/list.html',
      	controller  : 'tagsListController'
			})
	  .otherwise({
      	templateUrl : 'pages/notfound.html'
      });


      $locationProvider.html5Mode(true);
  });
