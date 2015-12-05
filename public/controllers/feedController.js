crudApp.controller('feedController', function($scope, $location, $http, sharedService) {

// angular.element(document.querySelector('[ng-controller=mainController]')).scope().showNavBar = true;


 $scope.search_tag = '';
 $scope.groupid = '';
 $scope.group = null;
 $scope.search = { tag: '' };
 //$scope.is_group_member = false;

 $scope.Groups = [
      {_id: "1", name: "Etobicoke", description :""},
      {_id: "565b5911afaf8bac32029661" , name: "Toronto", description :""},
      {_id: "3", name: "UofT", description :""},
      {_id: "4", name: "a new group", description :""},
      {_id: "65b5911afaf8bac32029672", name: "Announcement", description :""}
    ];



         $scope.Interests = [
      {_id: "aaaa", name: "fishing"},
      {_id: "bbbb" , name: "cats"},
      {_id: "cccc", name: "dogs"},
      {_id: "dddd", name: "real estate"},
      {_id: "565b5911afaf8bac3202966c", name: "Food"}
    ];



/*
group: "5660cdaa20bcd1782ec2225e"
Missing: groupname - Etobioke ---- we just jave groupid
avatarURL : "https://www.gravatar.com/avatar/89e0e971f58af7f776b880d41e2dde43?size=50",
where is interest???
On group search: should fill in description, name
Also, should smartly recommend the "Add myself to this group based on whether they're in the group"
*/




  $scope.Posts = [
     {_id: "aaaa5",
      username: "Chris" ,
      short_text: 'hey',
       userid: {
        imageurl: "https://www.gravatar.com/avatar/89e0e971f58af7f776b880d41e2dde43?size=50" },
      date_posted: 'Sun Nov 29 2015 14:59:13 GMT-0500 (Eastern Standard Time)',

      interestname : 'Cooking',
      groupname: 'Toronto',
      averagerating: 3.5,
       hashtags: ['great', 'cool', 'iheartmyTO']} ,
        {_id: "aaaa6",
      username: "Adam",
      userid: {
        imageurl: "https://i1.wp.com/slack.global.ssl.fastly.net/3654/img/avatars/ava_0001-72.png?ssl=1" },
      date_posted: 'Sun Nov 29 2015 14:59:13 GMT-0500 (Eastern Standard Time)',
      short_text: 'hello!',
      interestname : 'CS',
      groupname: 'Etobicoke',
      averagerating: 5,
       hashtags: ['wellthatwasfun', 'iheartmyTO']},
      {_id: "aaaa7",
      username: "Jim",
      userid: {
        imageurl: "https://avatars.slack-edge.com/2015-11-18/14843332005_64782944e2c667c5e73f_72.jpg" },
      date_posted: 'Sun Nov 29 2015 14:59:13 GMT-0500 (Eastern Standard Time)',
      short_text: 'hello world!',
      interestname : 'Toronto',
      groupname: 'SadUniLife',
      averagerating: 4.5,
       hashtags: ['wellthatwasfun', 'wholetthedogsoutwhowhowho']},
      {_id: "aaaa8",
      username: "Katie",
      userid: {
        imageurl: "https://secure.gravatar.com/avatar/524e5d5e8c92b9dcf1ad7f6bd582eb3c.jpg" },
      date_posted: 'Sun Nov 29 2015 14:59:13 GMT-0500 (Eastern Standard Time)',
      short_text: 'Want Christmas and kittens!',
      interestname : 'Etobicoke',
      groupname: 'EvenSaddderUniLife',
      averagerating: 4.5,
       hashtags: ['adeleonstage', 'lanaisofftotheraces']}
    ];


 $scope.getUserProfile = function(user_name) {
  alert('Go to the profile of: ' + user_name);
}

 $scope.getPostbyID = function(post_id) {
  //alert('Go to the post with ID: ' + post_id);
    var route = '/permalink/:' + post_id;
    $location.path(route);
}

 $scope.createNewPost = function(post_type) {
  alert(post_type);
 }

 var getPostsByInterest = function(interest_id) {
   $http({
        method: 'GET',
          url: '/interests/interest/posts', //get all user emails & displayname
          params: {id: interest_id}
      })
      .then(function successCallback(response) {
        $scope.Posts = response.data.posts;
        $scope.search_tag = response.data.interest;


      },
      function errorCallback(response) {
        console.log(response);

      });
 };

  var getMainFeedPosts = function() {
  $http({
      method: 'GET',
        url: '/dashboard', //get all user emails & displayname
    })
    .then(function successCallback(response) {
      $scope.Posts = response.data;
    },
    function errorCallback(response) {
      console.log(response);

    });
  };

  var getTagIndex = function() {
    $http({
      method: 'GET',
        url: '/tags', //get all user emails & displayname
    })
    .then(function successCallback(response) {
      console.log(response);

    },
    function errorCallback(response) {
      console.log(response);

    });
  };

  var getPostsByHashTag = function(hashtag) {
    $http({
        method: 'GET',
          url: '/tags/tag/posts', //get all user emails & displayname
          params: {tagname: hashtag}
      })
      .then(function successCallback(response) {
        $scope.Posts = response.data;
        $scope.search_tag = hashtag;
        //$scope.search_tag = response.data.interest;

      },
      function errorCallback(response) {
        console.log(response);

      });
  };



var getGroupByID = function(group_id){
  $http({
      method: 'GET',
        url: '/groups/group', //get all user emails & displayname
        params: {_id: group_id}
    })
    .then(function successCallback(response) {
      $scope.group = response.data.group;
      $scope.is_group_member = response.data.is_member;
      $scope.groupid = response.data.group._id;
      /*
_id: "5660faa0419858a825a6533f"
description: "Groups - I assume we will preload some groups. How does the user belong to a group? Can they choose any group to join? Are there public and private groups? Will the user only see posts for the groups that they are registered with? Right now, I have set it so that all groups are by default public, and I was thinking that if a group is private then users already in the group have the privilege to add others. search and rate things in neighbourhood Toronto overall. Does this mean search and rate posts in the group the user belongs to? Site events? Page views I understand, but what else goes into this? Post expiry date - why do we need it? What happens to the post after expiry? I am concerned because there are tuples in other tables that depend on the post, and reputation of the user is aggregated based on ratings on their posts, so we shouldn’t remove the posts. How to calculate the user’s reputation? Example: there could be 1 post with a five star rating made by one user. On the other hand, there could be a post where 100 users voted. Also, some users have only a few posts, while others have multiple. So I was thinking what if we will create some formula based on numbers of posts and 5, 4, … 1 rating counts, number of votes."
group_creator: "5660faa0419858a825a6534b"
name: "Toronto"
private_type: false
__proto__: Object

is_member: false
      */

    },
    function errorCallback(response) {
      console.log(response);

    });
};

var getGroupPosts = function(group_id){
  $http({
      method: 'GET',
        url: '/groups/group/posts', //get all user emails & displayname
        params: {groupid: group_id}
    })
    .then(function successCallback(response) {
      var reformattedPosts = response.data.posts.map(function(post){
        var post = post;
        post.group = {
          _id: post.group,
          name: response.data.groupname
        };
        return post;
    });
      $scope.Posts = reformattedPosts;
      console.log();
    },
    function errorCallback(response) {
      console.log(response);

    });
};


  var fullGroupList = function(){
    $http.get('/groups').success(function(data, status, headers, config) {
      console.log(data);
    });
  };

 var testScope = function(){

  $scope.state.is_group_page = true;
  $scope.$emit('update_test');
 }

 var populateFeed = function (){



 }


 $scope.addToGroup = function(){
  $http({
    method: 'POST',
    url: '/groups/group/addmember',
    data: {group: {_id: $scope.groupid}}
  })
  .then(function successCallback(response) {
        //$location.path('/dashboard'); // path not hash
        $scope.is_group_member = true;
        console.log(response.data.message);
     },
     function errorCallback(response) {
      console.log(response);
     });

 };

 $scope.removeFromGroup = function(){
  $http({
    method: 'PUT',
        url: '/groups/group/removemember', //get all user emails & displayname
        data: {group: {_id: $scope.groupid}}
    })
  .then(function successCallback(response) {
    $scope.is_group_member = false;
        console.log(response.data.message);
    },
    function errorCallback(response) {
      console.log(response);
    });
 };




 $scope.submitSearch = function(){
  //pass search data to top-level MainController, which will reload the view
  $scope.$emit('update_state_to_search', $scope.search.tag);
 };

 $scope.onTagClick = function(tagname){
  $scope.$emit('update_state_to_search', tagname);
 };

 $scope.onInterestClick = function(interestid){
  $scope.$emit('update_state_to_interest', interestid);
 };

$scope.onGroupClick = function(groupid){
  $scope.$emit('update_state_to_group', groupid);
 };

  var start = function(){
    if ($scope.state.is_group_page){
      var groupid = (sharedService.getData()).groupid;
      getGroupPosts(groupid);
      getGroupByID(groupid);
    } else if ($scope.state.is_showing_interest){
      var interestid = (sharedService.getData()).interestid;
      getPostsByInterest(interestid);
    } else if ($scope.state.main_feed){
      getMainFeedPosts();
    } else if ($scope.state.is_searching){
      var tag = (sharedService.getData()).tag;
      getPostsByHashTag(tag);
    }


  };



  start();

});
