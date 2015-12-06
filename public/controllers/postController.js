var crudApp = angular.module('crudApp');

crudApp.controller('postController', function ($scope, $http, $location, $timeout) {

	$scope.mySortFunction = function(item) {
			if(isNaN(item[$scope.sortExpression]))
				return item[$scope.sortExpression];
			return parseInt(item[$scope.sortExpression]);
	};

	$scope.showMsg = false;

	$scope.postList = [
     {_id: "aaaa5",
      username: "Chris" ,
      short_text: 'hey',
       userid: {
        imageurl: "https://www.gravatar.com/avatar/89e0e971f58af7f776b880d41e2dde43?size=50" },
      date_posted: 'Sun Nov 29 2015 14:59:13 GMT-0500 (Eastern Standard Time)',

      interestname : 'Cooking',
      groupname: 'Toronto',
      averagerating: 3.5,
       hashtags: ['great', 'cool', 'iheartmyTO']} ,
        {_id: "aaaa6",
      username: "Adam",
      userid: {
        imageurl: "https://i1.wp.com/slack.global.ssl.fastly.net/3654/img/avatars/ava_0001-72.png?ssl=1" },
      date_posted: 'Sun Nov 29 2015 14:59:13 GMT-0500 (Eastern Standard Time)',
      short_text: 'hello!',
      interestname : 'CS',
      groupname: 'Etobicoke',
      averagerating: 5,
       hashtags: ['wellthatwasfun', 'iheartmyTO']},
      {_id: "aaaa7",
      username: "Jim",
      userid: {
        imageurl: "https://avatars.slack-edge.com/2015-11-18/14843332005_64782944e2c667c5e73f_72.jpg" },
      date_posted: 'Sun Nov 29 2015 14:59:13 GMT-0500 (Eastern Standard Time)',
      short_text: 'hello world!',
      interestname : 'Toronto',
      groupname: 'SadUniLife',
      averagerating: 4.5,
       hashtags: ['wellthatwasfun', 'wholetthedogsoutwhowhowho']},
      {_id: "aaaa8",
      username: "Katie",
      userid: {
        imageurl: "https://secure.gravatar.com/avatar/524e5d5e8c92b9dcf1ad7f6bd582eb3c.jpg" },
      date_posted: 'Sun Nov 29 2015 14:59:13 GMT-0500 (Eastern Standard Time)',
      short_text: 'Want Christmas and kittens!',
      interestname : 'Etobicoke',
      groupname: 'EvenSaddderUniLife',
      averagerating: 4.5,
       hashtags: ['adeleonstage', 'lanaisofftotheraces']}
    ];

	// $http({
	// 	method:'GET',
	// 	url: '/posts'
	// }).then(function successCallback(res) {
	// 	$scope.postList = res.data.posts;

	// }, function errorCallback(res) {
	// 	console.log(res.data.error);
	// });

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
