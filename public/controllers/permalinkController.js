var crudApp = angular.module('crudApp');

crudApp.controller('permalinkController', function($scope, $location, $http, sharedService) {
  $scope.post = {_id: "aaaa5",
   username: "Chris" ,
   short_text: 'hey',
    userid: {
     imageurl: "https://www.gravatar.com/avatar/89e0e971f58af7f776b880d41e2dde43?size=50" },
   date_posted: 'Sun Nov 29 2015 14:59:13 GMT-0500 (Eastern Standard Time)',

   interestname : 'Cooking',
   groupname: 'Toronto',
   averagerating: 3.5,
    hashtags: ['great', 'cool', 'iheartmyTO']};
  $http.get('/posts?id='+$location.$$path.split('/')[2],function(post){
    if(post){
      $scope.post = post;
    }
  })
});
