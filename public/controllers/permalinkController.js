var crudApp = angular.module('crudApp');

crudApp.controller('permalinkController', function($scope, $location, $http, sharedService) {
  $scope.post = {};

  String.prototype.trimLeft = function(charlist) {
    if (charlist === undefined)
      charlist = "\s";

    return this.replace(new RegExp("^[" + charlist + "]+"), "");
  };
  function getUser(username){
    if($scope.localUsers[username] == undefined){
      $scope.localUsers[username] = {};
      $http.get('/users/profile?username='+username).then(function(user){
        $scope.localUsers[username] = user.data;
      },
      function errorCallback(response, status, headers, config) {
        if(status == 403){
        window.location = "/login";
        }
        console.log(response);
      });
    }
  }
  $scope.postId = $location.$$path.split('/')[2].trimLeft(':')
  $scope.localUsers = {}
  $http.get('/posts/post?id='+$scope.postId).then(function(post){
    if(post){
      $scope.post = post.data;
      getUser(post.data.username);
      for(var i in post.data.comments){
        getUser(post.data.comments[i].username);
      }
    }
  },
  function errorCallback(response, status, headers, config) {
    if(status == 403){
    window.location = "/login";
    }
    console.log(response);
  });


  $scope.currentRating = 0;

  $scope.ratePost = function(value){
    if($scope.currentRating > 0){
      $scope.currentRating = 0;
      return;
    }
    console.log("Rate "+$scope.postId+" at "+ value);
    $scope.currentRating = value;

    var data = {
        rating: {
        stars: value,
        postid: $scope.post._id,
        groupid: $scope.post.group._id
      }
    };

    $http({
      method: 'POST',
      url: '/posts/post/rate',
      data: data
    })
    .then(function successCallback(response) {
            console.log("Rated "+$scope.postId+" for "+ value);
            $scope.post.averagerating = response.data.averagerating;
          },
          function errorCallback(response) {
            console.log(response)
            $scope.currentRating = 0;
          });

  }
});
