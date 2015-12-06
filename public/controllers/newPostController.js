// Code goes here

var crudApp = angular.module('crudApp');

/**
 * Controller for login page template.
 */
 crudApp.controller('newPostController', function ($scope, $http, $location)  {


		 $scope.postTypes = [];
    $http.get('/posttypes/posttypes').success(function(data){
      console.log('postTypes', data);
      $scope.postTypes = data;
    });

 		 $scope.Groups = [];
    $http.get('/users/user/groups').success(function(data){
      console.log('Groups', data);
      $scope.Groups = data;
    });

		 $scope.Interests = [];
    $http.get('/interests').success(function(data){
      console.log('Interests', data);
      $scope.Interests = data;
    });



    $scope.post={

        short_text: '',
  date_posted: new Date,
  hashtags: ['Cool', 'Wow'],
  external_urls: [],
  comments: [],
  interest: null,
  userid: angular.element(document.querySelector('[ng-controller=mainController]')).scope().state.userid,
  username: angular.element(document.querySelector('[ng-controller=mainController]')).scope().state.username,
  text: '',
  group: null,
  post_type: null,
   new_comment: ''
    }

    $scope.$watch('post.text', function() {
      $scope.post.hashtags = [];
      var words = $scope.post.text.match(/\S+/g);
      for (var i in words) {
        if (words[i].slice(0, 1) == "#")
        {
            $scope.post.hashtags.push(words[i].slice(1));
        }
      }
      if(words && words.length > 50){
        $scope.post.short_text = "";
        var i = 0;
        while(i < 50) {
          if (words[i].slice(0, 1) == "#")
          {
              $scope.post.short_text += words[i] + " ";
          }
          i+=1;
        }
        $scope.post.short_text += "...";
      }
      else {
        $scope.post.short_text = $scope.post.text;
      }
  });

/*$scope.submitPost = function(){
  $scope.post.hashtags = ['Cool', 'Wow'];
  $http.post('/posts/addnew', {
    post: $scope.post
  }).success(function(data){
    $location.path('/permalink/'+data.result._id);
  });
}*/


$scope.submitPost = function(){
      console.log('HELLO?');
      var hashtags = ['Cool', 'Wow'];
      var data = {
        post: $scope.post,
        hashtags: hashtags
      };
      $http({
        method: 'POST',
        url: '/posts/addnew',
        data: data
      })
      .then(function successCallback(response) {
        $location.path('/permalink/'+ response.data.result._id);
      },
      function errorCallback(response) {
        console.log(response);
      });  
};



});
