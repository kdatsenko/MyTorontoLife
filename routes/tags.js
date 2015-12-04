var express = require('express');
var router = express.Router();

var moment = require('moment');
moment().format(); 

var models = {};
models.Groups = require('mongoose').model('Groups');
models.HashTags = require('mongoose').model('Hashtags');


/*
Get Hash Tags (Hash tag index)
There are two parameters, use_count, and date_last_used. Which takes precedent?
For now, I'll use date_last_used first, get tags used less than 100 days ago, order
by use_count descending, and extract the top 100 of the list.
*/
router.get('/', function(req, res) {
  var today = moment();
  var daysago = moment(today).subtract(100, 'days')
  models.HashTags.
  find({}).
  where('last_used').gt(daysago.toDate()).
  sort({ count: -1 }).
  limit(100).
  select('name').
  exec(function(err, tags){
    if (err) {
      return res.send(err);
    }
    return res.json(tags);
  });
});

/* Search Posts by Tagname. Get 100 most recent. */
router.get('/tag/posts', function(req, res) {
  //auth: only posts that are public, or that user is signed in to
  models.Groups.find({private_type: false}, {_id: 1}, function(err, docs) {
      // Map the docs into an array of just the _ids
      var ids_public = docs.map(function(doc) { return doc._id; }); //all the public group ids
      models.GroupMembers.find({user: req.session.user.id, group: {$nin : ids_public}}, {_id: 1}, function(err, docs){
        var ids_private = docs.map(function(doc) { return doc.group; });
        var merged_group_ids = ids_public.concat(ids_private);
        models.Posts.
        find({hashtags: { "$in" : [tagname]}, group: {"$in" : merged_group_ids}}).
        sort({ date_posted: -1 }).
        limit(100).
        select('post_type group short_text username userid date_posted averagerating numberofratings').
        exec(function(err, posts){
          if (err){
           return res.send(err);
          }
          return res.json(posts);
        });
      });
    });
});

module.exports = router;
