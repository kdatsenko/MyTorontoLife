var crudApp = angular.module('crudApp');

crudApp.controller('interestController', function ($scope, $http, $location, $timeout) {

	$scope.mySortFunction = function(item) {
			if(isNaN(item[$scope.sortExpression]))
				return item[$scope.sortExpression];
			return parseInt(item[$scope.sortExpression]);
		}

	$scope.showMsg = false;

	 $scope.interestList = [
      {_id: "aaaa", name: "fishing"},
      {_id: "bbbb" , name: "cats"},
      {_id: "cccc", name: "dogs"},
      {_id: "dddd", name: "real estate"},
      {_id: "565b5911afaf8bac3202966c", name: "Food"}
    ];


	// $http({
	// 	method:'GET',
	// 	url: '/interests'
	// }).then(function successCallback(res) {
	// 	$scope.interestList = res.data.interests;

	// }, function errorCallback(res) {
	// 	console.log(res.data.error);
	// });

	$scope.submitInterest = function () {
		if ($scope.interest == undefined) {
			$scope.showMsg = true;
			$scope.msg = "Please fill the blank";
			$timeout(function() {
				$scope.showMsg = false;
			}, 3000);
		} else {
			$http({
				method: 'POST',
				url: '/interests/addnew',
				data: JSON.stringify({
					name: $scope.interest
				})
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
