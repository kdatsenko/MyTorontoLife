// Code goes here

var crudApp = angular.module('crudApp');

/**
 * Controller for login page template.
 */
 crudApp.controller('newPostController', function ($scope)  {



		$scope.logininfoLists = [{useremail:'ok@ok.com', date:'12-13-2015',device :'mobile', OS: 'Windows',  browser:'Chrome',location: 'Toronto', screen_size : '760x280', IP: '127.0.0.2'},
                         {useremail:'katie@ok.com', date:'12-13-2015',device :'mobile', OS: 'Windows',  browser:'Chrome',location: 'Toronto', screen_size : '760x280', IP: '127.0.0.0'},
                         {useremail:'ok@ok.com', date:'12-13-2015',device :'mobile', OS: 'Windows',  browser:'AChrome',location: 'Toronto', screen_size : '760x280', IP: '127.0.0.2'},
                         {useremail:'ok@ok.com', date:'12-13-2015',device :'mobile', OS: 'ANDROID',  browser:'Chrome',location: 'Toronto', screen_size : '760x280', IP: '127.1.0.2'},
                         {useremail:'ok@ok.com', date:'12-12-2015',device :'DESCTOP', OS: 'Windows',  browser:'EXPLORER',location: 'AJAX', screen_size : '160x280', IP: '127.0.0.2'},
                         {useremail:'ok@ok.com', date:'12-13-2015',device :'Amobile', OS: 'Windows',  browser:'Chrome',location: 'Toronto', screen_size : '760x280', IP: '127.0.0.2'}]

				 $scope.postTypes = [
      {_id: "aaaa", name: "questions"},
      {_id: "bbbb" , name: "a business"},
      {_id: "cccc", name: "an event"},
      {_id: "dddd", name: "a classified posting"},
      {_id: "65b5911afaf8bac32029672", name: "Announcement"}
    ];

		 		 $scope.Groups = [
      {_id: "1", name: "Etobicoke"},
      {_id: "565b5911afaf8bac32029661" , name: "Toronto"},
      {_id: "3", name: "UofT"},
      {_id: "4", name: "a new group"},
      {_id: "65b5911afaf8bac32029672", name: "Announcement"}
    ];



    		 $scope.Interests = [
      {_id: "aaaa", name: "fishing"},
      {_id: "bbbb" , name: "cats"},
      {_id: "cccc", name: "dogs"},
      {_id: "dddd", name: "real estate"},
      {_id: "565b5911afaf8bac3202966c", name: "Food"}
    ];


    		 $scope.Rates = [
      {_id: "1", name: "1"},
      {_id: "2" , name: "2"},
      {_id: "3", name: "3"},
      {_id: "4", name: "4"},
      {_id: "5", name: "5"}
    ];


    $scope.post={

        short_text: 'hey',
  date_posted: 'Sun Nov 29 2015 14:59:13 GMT-0500 (Eastern Standard Time)',
  hashtags: [],
  external_urls: [],
  numberofratings: 30,
  averagerating: 3.5,
  commercial: false,
  comments: [{userid: '1', username: 'Adel', date: "Sun Nov 29 2015 14:59:13 GMT-0500 (Eastern Standard Time)",text: "I was wondering if after all these years you'd like to meet To go over everything They say that time's supposed to heal ya But I ain't done much healing Hello, can you hear me I'm in California dreaming about who we used to be "},
  {userid: '2', username: 'new user' ,date: "Sun Feb 29 2015 14:59:13 GMT-0500 (Eastern Standard Time)",text: "getting me some noms.."},
  {userid: '3', username: 'old user', date: "Sun Jan 29 2015 14:59:13 GMT-0500 (Eastern Standard Time)",text: "not sure what is it"},
  {userid: '4', username: 'lana' , date: "Sun Dec 29 2014 14:59:13 GMT-0500 (Eastern Standard Time)", text: "All I wanna do is get high by the beach Get high by the beach, get high All I wanna do is get by by the beach"}
  ],
  interest: { name: 'Food', _id: '565b5911afaf8bac3202966c' },
  userid: '565b5911afaf8bac3202965',
  username: 'Adele',
  text: 'Modern Australia is unflinchingly contemporary, but the land itself is ancient in geologic terms, with an Aboriginal history arcing back more than 50,000 years. You may think the best place to experience Aboriginal Australia is in the central deserts, Kakadu National Park or Arnhem Land, but Aboriginal Culture is the oldest living culture in the world, and as the times changed Aboriginal people have adapted whilst staying true to their unwavering connection to this land. Pin this image Performers at the Koorie Pride Festival, Melbourne. Image courtesy of Melbourne Museum',
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
