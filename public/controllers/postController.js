var crudApp = angular.module('crudApp');

crudApp.controller('postController', function ($scope, $http, $location, $timeout) {

	$scope.mySortFunction = function(item) {
			if(isNaN(item[$scope.sortExpression]))
				return item[$scope.sortExpression];
			return parseInt(item[$scope.sortExpression]);
	};

	$scope.showMsg = false;

	$http({
		method:'GET',
		url: '/posts'
	}).then(function successCallback(res) {
    console.log(res.data);
		$scope.postList = res.data;

	}, function errorCallback(res) {
		console.log(res.data.error);
	});

	$scope.getPost = function (id) {
		$location.path('/post/' + id);
	 };

	$scope.deletePost = function (id) {
		$http({
	 		method: 'DELETE',
	 		url: '/posts/post/' + id
	 	}).then(function successCallback(res) {
 			for (var i = 0; i < $scope.postList.length; i++) {
	 			if ($scope.postList[i]._id == id) {
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
