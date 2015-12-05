var crudApp = angular.module('crudApp')

crudApp.controller('loginbarController', function ($scope, $location, $http) {
  $scope.logout = angular.element(document.querySelector('[ng-controller=mainController]')).scope().logOut();
  
    $scope.profileClicked = function () {
        $location.path("/profile")
    }


    $http.get('/auth/loggedInUser').success(function(data, status, headers, config) {
        $scope.logged = data.logged
        if(data.user){
            $scope.username = data.user.username
        }
    }).error(function(data, status, headers, config){
      if(status == 403){
        $location.path('/');
      }
    });
})
