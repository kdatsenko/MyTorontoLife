var crudApp = angular.module('crudApp');


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
