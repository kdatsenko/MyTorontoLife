var crudApp = angular.module('crudApp');


 crudApp.controller('mainController', function($scope, $location, $http, $route, sharedService) {

 	$scope.showNavBar = true;
 	$scope.state = {

        username: 'Chris',
         admin: true,
         super_admin: true,
         profile_is_admin: true,
         main_dashboard: true,
         main_feed: true,
         admin_dashboard : false,
         is_logged : true,
         is_searching: false,
         is_group_page: false,
         is_showing_interest: false

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


    $scope.$on("update_nav_bar", function(event, show){
			$scope.showNavBar = show;
			console.log('I am triggered!');
			populateNavBar();
			/* Trigger the fill in methods */
	});



	$scope.$on("update_state_to_search", function(event, tagname){
		console.log('update_test I am triggered! ' + tagname);
		resetStateVariables();
		$scope.state.is_searching = true;
		sharedService.setData({tag : tagname});
  		$location.path("/feed");
  		$route.reload();
	});

	$scope.$on("update_state_to_group", function(event, groupid){
		$scope.getPostByGroup(groupid);
	});

	$scope.$on("update_state_to_interest", function(event, interestid){
		$scope.getPostByInterest(interestid);
	});

	/*$scope.$on("goto_profile", function(event, username){
		$scope.getUserProfile(username);
	});

	$scope.$on("goto_post", function(event, postid){
		$scope.getPostPage(postid);
	});*/


  $scope.showHero = true;

  $scope.logOut =
  $scope.logout = function(){
      $scope.state.is_logged = false;
      $http.get('/auth/logout').success(function(data, status, headers, config) {
          $scope.showLogin = false;
          $scope.showRegister = false;
          return $location.path('/'); // path not hash
      });
  }


 $scope.getPostByInterest = function(interest_id) {
 	 resetStateVariables();
	 $scope.state.is_showing_interest = true;
	 sharedService.setData({interestid : interest_id});
	 $location.path("/feed");
  	 $route.reload();

 };

$scope.getPostByGroup = function(group_id){
	resetStateVariables();
	$scope.state.is_group_page = true;
	sharedService.setData({groupid : group_id});
  	$location.path("/feed");
  	$route.reload();
};

 $scope.getAdminDashBoard = function() {
 	/*
	resetStateVariables();
 	$scope.state.main_dashboard = false;
 	$scope.state.admin_dashboard = true;
 	//sharedService.setData({username : user_name});
 	$location.path('/admin');


 	*/
 	alert('Admin Dash!');

};

$scope.getMainDashBoard = function() {
	resetStateVariables();
	$scope.state.main_dashboard = true;
 	$scope.state.main_feed = true;
 	$location.path("/feed");
  	$route.reload();
};


var resetStateVariables = function () {
	$scope.state.main_feed = false;
	$scope.state.is_showing_interest = false;
	$scope.state.is_group_page = false;
	$scope.state.admin_dashboard = false;
	$scope.state.is_searching = false;
};

 $scope.getUserProfile = function(user_name) {
 	resetStateVariables();
 	$scope.state.main_dashboard = false;
 	sharedService.setData({username : user_name});
 	$location.path('/profile');
 /* Navigate to User Profile page with this username. */
};

$scope.getPostPage = function (postid){
	alert(postid);
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
  }).error(function(data, status, headers, config) {
    // if(status == 403 )

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
  $http.get('/auth/loggedInUser').success(function(data, status, headers, config){
   if(data.logged == false && window.location.path != '/auth/github'){
     $location.path('/login');
   }
  });

 });
