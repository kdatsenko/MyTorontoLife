var admin = angular.module('admin', []);

admin.controller('admin', function ($scope, $http) {

	// $http({
	// 	method:'GET',
	// 	url: '/admin'
	// }).then(function successCallback(res) {
	// 	$scope.userList = res.data.users;
	// 	$scope.postList = res.data.posts;
	// 	$scope.interestList = res.data.interests;
	// 	$scope.groupList = res.data.groups;

	// }, function errorCallback(res) {
	// 	console.log(res);
	// });


	 $scope.groupList =
	 			[{_id: 13, name: 'Toronto'},
                  {_id: 14, name: 'Etobicoke'},
                  {_id: 15, name: 'Little Italy'},
                  {_id: 16, name: 'Kensington'},
                  {_id: 17, name: 'Guelph'},
                  {_id: 18, name: 'Old Mill'},
                  {_id: 19, name: 'Marys Housemates'},
                  {_id: 20, name: 'Distillery District'}];

	 $scope.userList = 
	 			[{email: 'hello@fromtheotherside.com',
				  password: 'dddd',
				  accounttype: 2, //0 for Super Admin, 1 for Admin, 2 for user
				  loggedin: 0,
				  username: 'Adele',
				  description: '25 now',
				  //validation between 10 and 200 (vampires!)
				  age: 25,
				  gender: 'female', //for aliens!
				  homeaddress: 'London',
				  workplace: 'Some label',
				  position: 'Songstress',
				  contactinfo: 'Forget it',
				  interests: [0, 2]},

				  {email: 'borntodie@lana.com',
				  password: 'dddd',
				  accounttype: 1, //0 for Super Admin, 1 for Admin, 2 for user
				  loggedin: 0,
				  username: 'LanaDelRey',
				  description: 'Off to the races!',
				  //validation between 10 and 200 (vampires!)
				  age: 25,
				  gender: 'female', //for aliens!
				  homeaddress: 'USA',
				  workplace: 'Some label',
				  position: 'Songstress',
				  contactinfo: 'Forget it',
				  interests: [0, 2]
				}];

	$scope.postList = [{_id: 7, name: 'Announcement'},
                  {_id: 8, name: 'Question'},
                  {_id: 9, name: 'Business Ad'},
                  {_id: 10, name: 'Event'},
                  {_id: 11, name: 'Sale Listing'},
                  {_id: 12, name: 'Poll'}];

    $scope.interestList = [{_id: 0, name: 'Food'},
                  {_id: 1, name: 'Bars'},
                  {_id: 2, name: 'Condo'},
                  {_id: 3, name: 'Parks and Recreation'},
                  {_id: 4, name: 'Hockey'},
                  {_id: 5, name: 'Cat Cafe'}];

	 $scope.getUser = function (email) {
	 	$location.path('/userProfile/' + email);
	 };

	 $scope.getPost = function (id) {
		$location.path('/post/' + id)
	 };

	 $scope.deleteInterest = function (id) {
	 	$http({
	 		method: 'POST',
	 		url: '/deleteInterest' + id
	 	}).then(function successCallback(res) {
	 		if (res.stauts == 'success') {
	 			for (var i = 0; i < $scope.interestList.length; i++) {
		 			if ($scope.interestList[i]._id == id) {
		 				$scope.interestList.splice(i, 1);
		 			}
	 			};
	 		} else {
	 			console.log(res.error);
	 		}
	 		
	 	}, function errorCallback(res) {
	 		console.log(res);
	 	});
	 };

	 $scope.deleteGroup = function (id) {
	 	$http({
	 		method: 'POST',
	 		url: '/deleteGroup' + id
	 	}).then(function successCallback(res) {
	 		if (res.status == 'success') {
	 			for (var i = 0; i < $scope.groupList.length; i++) {
		 			if ($scope.groupList[i]._id == id) {
		 				$scope.groupList.splice(i, 1);
		 			}
	 			};
	 		} else {
	 			console.log(res.error);
	 		}
	 		
	 	}, function errorCallback(res) {
	 		console.log(res);
	 	});
	 };


	 $scope.addGroup = function (id) {
	 	$http({
	 		method: 'GET',
	 		url: '/deleteGroup' + id
	 	}).then(function successCallback(res) {
	 		for (var i = 0; i < $scope.groupList.length; i++) {
	 			if ($scope.groupList[i]._id == id) {
	 				$scope.groupList.splice(i, 1);
	 			}
	 		};
	 	}, function errorCallback(res) {
	 		console.log(res);
	 	});
	 };


});