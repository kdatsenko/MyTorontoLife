var express = require('express');
var router = express.Router();

var models = {};
models.Users = require('mongoose').model('Users');
models.GroupMembers = require('mongoose').model('GroupMembers');
models.PostRatings = require('mongoose').model('PostRatings');
models.Posts = require('mongoose').model('Posts');


/*
Get feed from groups: Get most recent feed from all user's groups
*/
var getGroupFeed = function (req, res) {
  models.GroupMembers.find({user: req.session.user._id}, 'group').exec(function(err, docs){
      if (err){
        return res.send(err);
      } else if (!docs){
        console.log('No groups, nothing to show here!')
        return res.json('');
      }
      var group_ids = docs.map(function(obj) { return obj.group; });
      models.Posts.find({group: { "$in" : group_ids}}).
      populate({
        path: 'userid',
        select: 'imageurl'
      }).
      populate({
        path: 'interest',
        select: 'name'
      }).
      populate({
        path: 'group',
        select: 'name'
      })
      .sort({ date_posted: -1 })
      .limit(100)
      .select('post_type group short_text username userid date_posted averagerating interest hashtags numberofratings')
      .exec(function(err, posts){
        if (err){
          return res.send(err);
        }
        res.json(posts);
      });
  });
};

/*
Generate Posts for Main Feed on Dashboard
0. Get all interests (a, b, c) and groups (1, 2, 3) of this user
1. Find all users who have intersecting interests (a,b,c) AND are in intersecting groups (1,2,3).
2. Find posts rated by users in (1) as 4, 5, created less than a year ago, and NOT rated by THIS (self) user,
limit to top 100.
3. (select relevant fields)!

*** If at any point, search result comes up empty display generic group feed for this user. ***
Function: getGroupFeed

*/
router.get('/', function(req, res) {
  models.Users.findOne({_id: req.session.user._id}).exec(function(err, docs){
     if (err){
        return res.send(err);
     }
     var interest_ids = docs.interests.map(function(id) { return id; }); //array of ids
     if (interest_ids.length == 0){
        console.log('No interests, nothing to show here!');
        getGroupFeed(req, res);
        return;
     }
     models.GroupMembers.find({user: req.session.user._id}, 'group').exec(function(err, docs){
        if (err){
          return res.send(err);
        } else if (!docs){
          console.log('No groups, nothing to show here!');
          getGroupFeed(req, res);
          return;
        }
        var group_ids = docs.map(function(obj) { return obj.group; });
        //find all users with interests (a, b or c) AND in a group of (1, 2, or 3)
        models.Users.find({ _id: {$ne: req.session.user._id}, interests: { "$in" : interest_ids} }, '_id').exec(function(err, docs){
          if (err){
            return res.send(err);
          } else if (!docs){
            //no Users with mutual interests
            //GOTO: Group feed for this user!
            getGroupFeed(req, res);
            return;
          }

           var user_ids = docs.map(function(obj) { return obj._id; });

           models.GroupMembers.find({user: {$ne: req.session.user._id, "$in" : user_ids}, group: { "$in" : group_ids} }, 'user').exec(function(err, docs){
            if (err){
              return res.send(err);
            } else if(!docs){
              //no Users with mutual interests & mutual groups
              //GOTO: Group feed for this user!
              getGroupFeed(req, res);
              return;
            }
            var intersect_users = docs.map(function(obj) { return obj.user; });
            console.log('intersect_users: ' + intersect_users);
            models.PostRatings
            .find({userid: { "$in" : intersect_users} })
            .where('rating').gt(3).lt(6) //rated as 4 or 5
            .select('postid')
            .exec(function(err, docs){ //anything they rated as 4 or 5
              if (err) { return res.send(err); }
              else if (!docs) {
                //no Users with mutual interests & mutual groups & rated posts
                //GOTO: Group feed for this user!
                getGroupFeed(req, res);
                return;
              }
              var temppostids = docs.map(function(obj) { return obj.postid; });
              //Get all posts that 'this' user has not seen before (via rating).
              models.PostRatings.find({postid: { "$in" : temppostids}, userid: req.session.user._id}, 'postid').exec(function(err, docs){
                if (err) { return res.send(err); }
                console.log('temppostids: ' + temppostids + ' seenpostsids' + (docs.map(function(obj) { return obj.postid; })));
                var finalpostids = [];
                if(!docs) { //this user has not rated anything, safe to skip additional "already seen" check
                  finalpostids = temppostids;
                } else {
                  var seenpostids = docs.map(function(obj) { return obj.postid; });
                  for (var i = 0; i < temppostids.length; i++){
                      var bad = false;
                      for (var j = 0; j < seenpostids; j++){
                        if (temppostids[i] == seenpostids[j]){
                          bad = true;
                          break;
                        }
                      } //END INNER FOR seenpostids
                      if (!bad){
                        finalpostids.push(temppostids[i]);
                      }
                  } //END OUTER FOR temppostids
                }
                if (finalpostids.length == 0){
                  //no special posts, give up
                  //GOTO: Group feed for this user!
                  getGroupFeed(req, res);
                  return;
                }

                var cutoff = new Date();
                cutoff.setDate(-100);

                models.Posts
                .find({_id : {"$in" : finalpostids}}).
                populate({
                  path: 'userid',
                  select: 'imageurl'
                }).
                populate({
                  path: 'interest',
                  select: 'name'
                }).
                populate({
                  path: 'group',
                  select: 'name'
                })
                .where('date_posted').gt(cutoff)
                .sort({ date_posted: -1 })
                .limit(100)
                .select('post_type group short_text username userid date_posted averagerating hashtags umberofratings')
                .exec(function(err, posts){

                  if (err) {return res.send(err); }
                  if (!posts){
                    //no special posts, give up
                    //GOTO: Group feed for this user!
                    getGroupFeed(req, res);
                    return;
                  }
                  //FINALLY
                  if(posts == [])
                  {
                    // Send sample data when there are no posts
                    posts = [
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
                  }
                  res.json(posts);
                });


              }); //END NOT rated by THIS (self) user,

            }); //ENd Find posts rated by users in (1) as 4, 5

           }); //END intersecting users.


        }); //find all users with interests (a, b or c) AND in a group of (1, 2, or 3)

     });
    });


});

module.exports = router;
