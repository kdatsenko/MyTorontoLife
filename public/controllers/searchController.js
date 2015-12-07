// Code goes here

var crudApp = angular.module('crudApp');

/**
 * Controller for login page template.
 */
crudApp.controller('searchController', function ($scope, $http)  {
  $mainScope = angular.element(document.querySelector('[ng-controller="mainController"]')).scope();
  $feedScope = angular.element(document.querySelector('[ng-controller="feedController"]')).scope();
  $scope.submitSearch = function(){

  }
  $scope.search_text = "";
  $scope.search_results = {};
  var searchTimeout = null;
  $scope.$watch("search_text", function(){

      if(searchTimeout){clearTimeout(searchTimeout)}
      searchTimeout = setTimeout(function(){
        searchTimeout = null;
        if($scope.search_text != ""){
          $mainScope.state.is_searching = true;
          $feedScope.search_tag = $scope.search_text;
          $http.get('/posts/search?q='+$scope.search_text).success(function(data){
              $feedScope.Posts = data.data;
              for(var i in $feedScope.Posts){
                $feedScope.Posts[i].userid.imgurl = $feedScope.Posts[i].imageurl;
              }
          });
        }
        else{
        $mainScope.state.is_searching = false;
        $http.get('/dashboard').success(function(data){
            $feedScope.Posts = data;
            for(var i in $feedScope.Posts){
              $feedScope.Posts[i].userid.imgurl = $feedScope.Posts[i].imageurl;
            }
        });
      }
      }, 250);
  });

});
