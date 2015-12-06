var crudApp = angular.module('crudApp');

crudApp.controller('userController', function ($scope, $http, $location, $timeout) {

	$scope.mySortFunction = function(item) {
			if(isNaN(item[$scope.sortExpression]))
				return item[$scope.sortExpression];
			return parseInt(item[$scope.sortExpression]);
	};

	$scope.showMsg = false;

	$http({
		method:'GET',
		url: '/users'
	}).then(function successCallback(res) {
		console.log(res.data);
		$scope.userList = res.data;

	}, function errorCallback(res) {
		console.log(res.data.error);
	});

	 $scope.getUser = function (username) {
	 	$location.path('/profile/' + username);
	 };


	$scope.assignAdmin = function (email) {
		$http({
			method: 'PUT',
			url: 'users/user/assignadmin/' + email
		}).then(function successCallback(res) {
			$http({
				method:'GET',
				url: '/users'
			}).then(function successCallback(res) {
				console.log(res.data);
				$scope.userList = res.data;

			}, function errorCallback(res) {
				console.log(res.data.error);
			});
			$scope.showMsg = true;
			$scope.msg = res.data.message;
			$timeout(function() {
				$scope.showMsg = false;
			}, 3000);
		}), function errorCallback(res) {
			$scope.showMsg = true;
			$scope.msg = res.data.error;
			$timeout(function() {
				$scope.showMsg = false;
			}, 3000);
		};
	};

	$scope.unassignAdmin = function (email) {
		$http({
			method: 'PUT',
			url: 'users/user/revokeadmin/' + email
		}).then(function successCallback(res) {
			$http({
				method:'GET',
				url: '/users'
			}).then(function successCallback(res) {
				console.log(res.data);
				$scope.userList = res.data;

			}, function errorCallback(res) {
				console.log(res.data.error);
			});
			$scope.showMsg = true;
			$scope.msg = res.data.message;
			$timeout(function() {
				$scope.showMsg = false;
			}, 3000);
		}), function errorCallback(res) {
			$scope.showMsg = true;
			$scope.msg = res.data.error;
			$timeout(function() {
				$scope.showMsg = false;
			}, 3000);
		};
	};


	 $scope.deleteUser = function (id) {
	 	$http({
	 		method: 'DELETE',
	 		url: '/users/profile/' + id
	 	}).then(function successCallback(res) {
 			for (var i = 0; i < $scope.userList.length; i++) {
	 			if ($scope.userList[i]._id == id) {
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
			$scope.msg = res.data.message;
			$timeout(function() {
				$scope.showMsg = false;
			}, 3000);
	 	});
	 };
});
