var admin = angular.module('admin', ['ngRoute']);


// $scope.groupList =
// 	 			[{_id: 13, name: 'Toronto'},
//                   {_id: 14, name: 'Etobicoke'},
//                   {_id: 15, name: 'Little Italy'},
//                   {_id: 16, name: 'Kensington'},
//                   {_id: 17, name: 'Guelph'},
//                   {_id: 18, name: 'Old Mill'},
//                   {_id: 19, name: 'Marys Housemates'},
//                   {_id: 20, name: 'Distillery District'}];

// 	 $scope.userList = 
// 	 			[{email: 'hello@fromtheotherside.com',
// 				  password: 'dddd',
// 				  accounttype: 2, //0 for Super Admin, 1 for Admin, 2 for user
// 				  loggedin: 0,
// 				  username: 'Adele',
// 				  description: '25 now',
// 				  //validation between 10 and 200 (vampires!)
// 				  age: 25,
// 				  gender: 'female', //for aliens!
// 				  homeaddress: 'London',
// 				  workplace: 'Some label',
// 				  position: 'Songstress',
// 				  contactinfo: 'Forget it',
// 				  interests: [0, 2]},

// 				  {email: 'borntodie@lana.com',
// 				  password: 'dddd',
// 				  accounttype: 1, //0 for Super Admin, 1 for Admin, 2 for user
// 				  loggedin: 0,
// 				  username: 'LanaDelRey',
// 				  description: 'Off to the races!',
// 				  //validation between 10 and 200 (vampires!)
// 				  age: 25,
// 				  gender: 'female', //for aliens!
// 				  homeaddress: 'USA',
// 				  workplace: 'Some label',
// 				  position: 'Songstress',
// 				  contactinfo: 'Forget it',
// 				  interests: [0, 2]
// 				}];

// 	$scope.postList = [{_id: 7, name: 'Announcement'},
//                   {_id: 8, name: 'Question'},
//                   {_id: 9, name: 'Business Ad'},
//                   {_id: 10, name: 'Event'},
//                   {_id: 11, name: 'Sale Listing'},
//                   {_id: 12, name: 'Poll'}];

//     $scope.interestList = [{_id: 0, name: 'Food'},
//                   {_id: 1, name: 'Bars'},
//                   {_id: 2, name: 'Condo'},
//                   {_id: 3, name: 'Parks and Recreation'},
//                   {_id: 4, name: 'Hockey'},
//                   {_id: 5, name: 'Cat Cafe'}];


admin.config(function ($routeProvider, $locationProvider) {
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
	$routeProvider.otherwire({redirectTo: '/'});

	$locationProvider.html5Mode({enabled: true,requireBase: false});
});




admin.controller('groupController', function ($scope, $http, $location) {

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


admin.controller('interestController', function ($scope, $http, $location) {

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


admin.controller('postController', function ($scope, $http, $location) {

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


admin.controller('userController', function ($scope, $http, $location) {

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