var express = require('express');
var router = express.Router();

models = {};
models.Users = require('mongoose').model('Users');
models.GroupMembers = require('mongoose').model('GroupMembers');
models.PostRatings = require('mongoose').model('PostRatings');
models.Posts = require('mongoose').model('Posts');


/*
Get feed from groups: Get most recent feed from all user's groups
*/
var getGroupFeed = function (req, res) {
  models.GroupMembers.find({user: req.session.user.id}, 'group').exec(function(err, docs){
      if (err){
        return res.send(err);
      } else if (!docs){
        console.log('No groups, nothing to show here!')
        return res.json('');
      }
      var group_ids = docs.map(function(obj) { return obj.group; });
      models.Posts.find({group: { "$in" : group_ids}})
      .sort({ date_posted: -1 })
      .limit(100)
      .select('post_type group short_text username userid date_posted averagerating numberofratings')
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
  models.Users.findOne({_id: req.session.user.id}).exec(function(err, docs){
     if (err){
        return res.send(err);
     }
     var interest_ids = docs.interests.map(function(id) { return id; }); //array of ids
     if (interest_ids.length == 0){
        console.log('No interests, nothing to show here!');
        getGroupFeed(req, res);
        return;
     }
     models.GroupMembers.find({user: req.session.user.id}, 'group').exec(function(err, docs){
        if (err){
          return res.send(err);
        } else if (!docs){
          console.log('No groups, nothing to show here!');
          getGroupFeed(req, res);
          return;
        }
        var group_ids = docs.map(function(obj) { return obj.group; });

        //find all users with interests (a, b or c) AND in a group of (1, 2, or 3)
        models.Users.find({ _id: {$ne: req.session.user.id}, interests: { "$in" : interest_ids} }, '_id').exec(function(err, docs){
          if (err){
            return res.send(err);
          } else if (!docs){
            //no Users with mutual interests
            //GOTO: Group feed for this user!
            getGroupFeed(req, res);
            return;
          }

           var user_ids = docs.map(function(obj) { return obj._id; });
           models.GroupMembers.find({user: {$ne: req.session.user.id}, group: { "$in" : group_ids}, user: { "$in" : user_ids} }, '_id').exec(function(err, docs){
            if (err){
              return res.send(err);
            } else if(!docs){
              //no Users with mutual interests & mutual groups
              //GOTO: Group feed for this user!
              getGroupFeed(req, res);
              return;
            }
            var intersect_users = docs.map(function(obj) { return obj.user; });
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
              models.PostRatings.find({postid: { "$in" : temppostids}, user : req.session.user.id}, 'postid').exec(function(err, docs){
                if (err) { return res.send(err); }
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

                var today = moment();
                var daysago = moment(today).subtract(100, 'days');

                models.Posts
                .find({_id : {"$in" : finalpostids}})
                .where('date_posted').gt(daysago.toDate())
                .limit(100)
                .select('post_type group short_text username userid date_posted averagerating numberofratings')
                .exec(function(err, posts){
                  if (err) {return res.send(err); }
                  if (!posts){
                    //no special posts, give up
                    //GOTO: Group feed for this user!
                    getGroupFeed(req, res);
                    return;
                  }
                  //FINALLY
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
