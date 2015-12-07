// Code goes here

var crudApp = angular.module('crudApp');

/**
 * Controller for login page template.
 */
crudApp.controller('searchController', function ($scope, $http)  {
  $mainScope = function(){return angular.element(document.querySelector('[ng-controller="mainController"]')).scope();}
  $feedScope = function(){return angular.element(document.querySelector('[ng-controller="feedController"]')).scope();}
  $scope.submitSearch = function(){
    // doing search on textchange instead of submit
  }
  $scope.search_text = "";
  $scope.search_results = {};
  var last_search = "";
  $scope.$watch("search_text", function(){
        if($scope.search_text != ""){
          $mainScope().state.is_searching = true;
          $mainScope().state.is_group_page = false;
          $feedScope().search_tag = $scope.search_text;
          $http.get('/posts/search?q='+$scope.search_text).success(function(data, a, b, c){
              last_search = c.url.split('=')[1];
              if($scope.search_text == last_search){
                $feedScope().Posts = data.data;
                for(var i in $feedScope().Posts){
                  $feedScope().Posts[i].userid.imgurl = $feedScope().Posts[i].imageurl;
                }
                setTimeout($feedScope().$apply, 50);
              }
          });
        }
        else if(last_search != ""){
          last_search = "";
          $mainScope().getMainDashBoard();
      }
  });

});
