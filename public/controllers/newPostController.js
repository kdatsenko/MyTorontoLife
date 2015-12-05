// Code goes here

var crudApp = angular.module('crudApp');

/**
 * Controller for login page template.
 */
 crudApp.controller('newPostController', function ($scope, $http)  {


				 $scope.postTypes = [];
    $http.get('/posttypes/posttypes').success(function(data){
      $scope.postTypes = data;
    });

		 		 $scope.Groups = [];
    $http.get('/groups').success(function(data){
      $scope.Groups = data;
    });

    		 $scope.Interests = [ ];
    $http.get('/interests').success(function(data){
      $scope.Interests = data;
    });



    $scope.post={

        short_text: '',
  date_posted: new Date,
  hashtags: [],
  external_urls: [],
  numberofratings: 30,
  averagerating: 3.5,
  commercial: false,
  comments: [],
  interest: { name: 'Food', _id: '565b5911afaf8bac3202966c' },
  userid: '565b5911afaf8bac3202965',
  username: 'Adele',
  text: '',
  group:{  name: 'Toronto', _id: '565b5911afaf8bac32029661'},
  post_type: { name: 'Announcement', _id: '65b5911afaf8bac32029672' },
  _id: '565b5911afaf8bac32029669',
   new_comment: ''
    }

 $scope.state = {
        edit_state: true,
        add_new: false,
        admin: true,
        super_admin: true,
        profile_is_admin: true,
         user_is_author : false ,
         users_post_rating : 5

      };



    optPostType = $.grep($scope.postTypes , function(e){ return e._id === $scope.post.post_type._id; });

    if (optPostType.length > 0) {
        $scope.postTypeValue  = optPostType[0]
    }
    optGroup = $.grep($scope.Groups , function(e){ return e._id === $scope.post.group._id; });

    if (optGroup.length > 0) {

        $scope.postGroupValue  =  optGroup[0]
    }
     optInterest = $.grep($scope.Interests , function(e){ return e._id === $scope.post.interest._id; });

    if (optInterest.length > 0) {
        $scope.postInterestValue  = optInterest[0]
    }

      optInterest = $.grep($scope.Interests , function(e){ return e._id === $scope.post.interest._id; });

    if (optInterest.length > 0) {
        $scope.postInterestValue  = optInterest[0]
    }

     optRate = $.grep($scope.Rates , function(e){ return e._id === $scope.state.users_post_rating.toString(); });

    if (optRate.length > 0) {
        $scope.postRateValue  = optRate[0]
    }




			 $scope.getRating = function(rate)
    {
      return rate.name;
    };

	 $scope.getpostType = function(type)
    {
      return type.name;
    };
	$scope.getGroup = function(group)
    {
      return group.name;
    };
    	$scope.getInterest = function(interest)
    {
      return interest.name;
    };

});
