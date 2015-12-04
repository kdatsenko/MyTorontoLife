var express = require('express');
var router = express.Router();

var models = {};
models.GroupMembers = require('mongoose').model('GroupMembers');
models.Posts = require('mongoose').model('Posts');
models.Interests = require('mongoose').model('Interests');
models.Groups = require('mongoose').model('Groups');


/* Get all Interests */
router.get('/', function(req, res) {
  //Retrieve entire interest list from DB
  models.Interests.find({}, function(err, interests) {
    if (err) {
      return res.send(err);
    }
    res.json(interests);
    });
});


/* Create new Interest (only Admins) */
router.post('/addnew', function(req, res){
//var createInterest = function(interest){ //requireLogin
  if (!checkAdmin(req, res, 1) & !checkAdmin(req, res, 0)){ //check for admin rights
     return res.status(403).send({error: 'Unauthorized account type'});
  }
  var interest = new models.Interests(req.body.interest); //create new
  models.Interests.findOne({name: interest.name}, function(err, found_interest) { //name should be unique
          if (err){
            return res.send(err);
          }
          if (!found_interest) { //THERE Couldn't be found a user with this group name
              interest.save(function(err) {
                  if (err) {
                      return res.send(err); //ERROR
                  }
                  res.json({ message: 'Interest added!' });
              });
          } else {
            return res.status(401).send({error: "That interest already exists."});
          }
      }); //FINDONE
});

/*
1. Get Posts By Interest.
2. Where the post group is public, or the user is member of that group
3. Order by most recent date, rating, get top 100 first
*/
router.get('/interest/posts', function(req, res) {

  models.Interests.findOne({_id: req.query.id}, function (err, found_interest){
    if (err){
      return res.send(err);
    } else if(!found_interest){
      return res.status(404).send({error: 'Interest ' + req.query.id + ' does not exist.'});
    }
    models.Groups.find({private_type: false}, {_id : 1}, function(err, docs) {
       if (err) { return res.send(err); }
      // Map the docs into an array of just the _ids
      var ids_public = docs.map(function(doc) { return doc._id; }); //all the public group ids
      models.GroupMembers.find({user: req.session.user.id, group: {$nin : ids_public}}, {_id: 1}, function(err, docs){

        var ids_private = docs.map(function(doc) { return doc.group; });
        var merged_group_ids = ids_public.concat(ids_private);
        models.Posts.
        find({group: { "$in" : merged_group_ids}, interest: found_interest._id}).
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
        }).
        sort({date_posted: -1}).
        limit(100).
        select('post_type group short_text username userid date_posted averagerating interest numberofratings hashtags').
        exec(function(err, posts){
          if (err) {
            return res.send(err);
          }
          return res.json(posts);
        });
    });
   });
  });
});



module.exports = router;
