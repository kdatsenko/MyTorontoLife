var crudApp = angular.module('crudApp');

crudApp.controller('permalinkController', function($scope, $location, $http, $interval, sharedService) {
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
  $scope.loading = true;
  function loadPost(){
    $scope.loading = true;
    $http.get('/posts/post?id='+$scope.postId).then(function(post){
      $scope.loading = false;
      if($scope.post != {} && post.data.comments && $scope.post.comments && post.data.comments.length > $scope.post.comments.length){
        for(var i = $scope.post.comments.length; i < post.data.comments.length; i++)
        {
          $scope.post.comments.push(post.data.comments[i])
        }
      }
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
  }
  loadPost();
  $interval(loadPost, 5000); // Automatically update comments;

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

  $scope.new_comment = "";
  $scope.saveComment = function(){
    if($scope.new_comment){
      $http({
        method: 'POST',
        url: '/posts/post/addcomment',
        data: {comment:{
            group: $scope.post.group._id,
            postid: $scope.post._id,
            text: $scope.new_comment
          }
        }
      })
      .then(function successCallback(response) {
        loadPost();
      },
      function errorCallback(response) {
        console.log(response);
      });
    }
  }
});
