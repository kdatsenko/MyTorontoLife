// Code goes here

var crudApp = angular.module('crudApp');

/**
 * Controller for login page template.
 */
crudApp.controller('tagsListController', function ($scope, $http)  {
    $scope.loading=true;
    $scope.listTitle="All Tags";
    $scope.listDesc="Select a tag to see posts with that tag";
    $scope.theList=[];
    $http.get('/tags').success(function(response) {
      for(item in response){
        console.log(item);
        $scope.theList.push({title: response[item].name, href: '/tags/'+response[item].name});
      }
    }).error(function (data, status, headers, config) {
      if(status == 403){
        alert('Please login to see the tags list');
      }
    });

});
