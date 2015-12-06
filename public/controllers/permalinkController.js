var crudApp = angular.module('crudApp');

crudApp.controller('permalinkController', function($scope, $location, $http, sharedService) {
  $scope.post = {};
  $http.get('/posts/post?id='+$location.$$path.split('/')[2]).then(function(post){
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
