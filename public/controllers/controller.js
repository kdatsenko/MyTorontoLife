// create the module
var crudApp = angular.module('crudApp', ['ngRoute']);

/* Configuration of routes. */
crudApp.config(function($routeProvider, $locationProvider) {
	$routeProvider
      // route for the home page
		 .when('/', {
      	templateUrl : 'pages/feed.html',
      	controller  : 'feedController'
     })
     .when('/login', {
      	templateUrl : 'pages/login.html',
      	controller  : 'loginController'
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

			.when('/permalink/', {
      	templateUrl : 'pages/postpermalink.html',
      	controller  : 'PostPermalinkController'
      })

	    .when('/feed', {
      	templateUrl : 'pages/feed.html',
      	controller  : 'feedController'
      })

			.when('/groups', {
      	templateUrl : 'pages/list.html',
      	controller  : 'groupsListController'
      })
			.when('/groups/:group_id', {
      	templateUrl : 'pages/feed.html',
      	controller  : 'GroupController'
      })

			.when('/tags', {
      	templateUrl : 'pages/list.html',
      	controller  : 'tagsListController'
      })
			.when('/tags/:tag_id', {
      	templateUrl : 'pages/feed.html',
      	controller  : 'TagController'
      })

			.when('/create-post', {
      	templateUrl : 'pages/newpost.html',
      	controller  : 'newPostController'
      })

			.otherwise({
      templateUrl: 'pages/notfound.html'
    });

      $locationProvider.html5Mode(true);
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
    type: 'group', /* types: , group, tag */
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
      },
			{
        user:{
          username: "Chris",
          imageurl: "https://www.gravatar.com/avatar/89e0e971f58af7f776b880d41e2dde43?size=50"
        },
        html:"<p>This is my post!</p>"
      },
			{
        user:{
          username: "Chris",
          imageurl: "https://www.gravatar.com/avatar/89e0e971f58af7f776b880d41e2dde43?size=50"
        },
        html:"<p>This is my post!</p>"
      },
			{
        user:{
          username: "Chris",
          imageurl: "https://www.gravatar.com/avatar/89e0e971f58af7f776b880d41e2dde43?size=50"
        },
        html:"<p>This is my post!</p>"
      },{
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
