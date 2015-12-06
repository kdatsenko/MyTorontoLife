var crudApp = angular.module('crudApp');

crudApp.controller('permalinkController', function($scope, $location, $http, sharedService) {
  $scope.post = {};
  String.prototype.trimLeft = function(charlist) {
    if (charlist === undefined)
      charlist = "\s";

    return this.replace(new RegExp("^[" + charlist + "]+"), "");
  };
  $scope.postId = $location.$$path.split('/')[2].trimLeft(':')
  $http.get('/posts/post?id='+$scope.postId).then(function(post){
    console.log(post);
    if(post){
      $scope.post = post.data;
    }
  },
  function errorCallback(response, status, headers, config) {
    if(status == 403){
    window.location = "/login";
    }
    console.log(response);

  });
});
