var adminProfile = angular.module('adminProfile', []);

adminProfile.controller('adminProfile', function ($scope, $timeout, $http) {
	$scope.showMsg = false;
	$scope.msg = '';
	$scope.submit = function() {
		if($scope.newPwd != $scope.confirmPwd) {
			$scope.showMsg = true;
		    $scope.msg = "Passwords Don't Match";
		    $timeout(function() {
				$scope.showMsg = false; }, 3000);
		} else if($scope.newPwd == undefined || $scope.newPwd.length == 0 || 
			$scope.currentPwd == undefined || $scope.currentPwd.length == 0) {
			$scope.showMsg = true;
		    $scope.msg = "Please fill out all the fields";
			$timeout(function() {
				$scope.showMsg = false; }, 3000);
		} else {
				$scope.showMsg = false;

				$http({
					method: 'POST',
					url: '/'  // admin email
				}).then (function successCallback(res) {
					if (res.status == 'success') {
						$scope.showMsg = true;
					    $scope.msg = res.success;
					    $timeout(function() {
							$scope.showMsg = false; }, 3000);
					} else {
						console.log(res.error);
					}
				}, function errorCallback(res) {
					console.log(res);
				});
		}
	};
	


});