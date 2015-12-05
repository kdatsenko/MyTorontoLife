var crudApp = angular.module('crudApp');


crudApp.controller('groupController', function ($scope, $http, $location, $timeout) {

	$scope.mySortFunction = function(item) {
			if(isNaN(item[$scope.sortExpression]))
				return item[$scope.sortExpression];
			return parseInt(item[$scope.sortExpression]);
		}

	$scope.showMsg = false;

	$scope.groupList = [
      {_id: "1", name: "Etobicoke", description :""},
      {_id: "565b5911afaf8bac32029661" , name: "Toronto", description :""},
      {_id: "3", name: "UofT", description :""},
      {_id: "4", name: "a new group", description :""},
      {_id: "65b5911afaf8bac32029672", name: "Announcement", description :""}
    ];


	// $http({
	// 	method:'GET',
	// 	url: '/groups'
	// }).then(function successCallback(res) {
	// 	$scope.groupList = res.data.groups;

	// }, function errorCallback(res) {
	// 	console.log(res.data.error);
	// });

	$scope.submitGroup = function () {
		if ($scope.group == undefined || $scope.privateType == undefined || $scope.description == undefined) {
			$scope.showMsg = true;
			$scope.msg = "Please fill the blank";
			$timeout(function() {
				$scope.showMsg = false;
			}, 3000);
		} else {

			$http({
				method: 'POST',
				url: 'groups/addnew',
				data: JSON.stringify({
					name: $scope.group,
					private_type: $scope.privateType,
					description: $scope.description
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
