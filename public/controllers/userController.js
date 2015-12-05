var crudApp = angular.module('crudApp');

crudApp.controller('userController', function ($scope, $http, $location, $timeout) {

	$scope.mySortFunction = function(item) {
			if(isNaN(item[$scope.sortExpression]))
				return item[$scope.sortExpression];
			return parseInt(item[$scope.sortExpression]);
		}

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

		$http({
			method:'GET',
			url: '/users'
		}).then(function successCallback(res) {
			$scope.userList = res.data;

		}, function errorCallback(res) {
			console.log(res.data.error);
		});

		 $scope.getUser = function (username) {
		 	$location.path('/profile/' + username);
		 };


	 $scope.deleteUser = function (id) {
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
