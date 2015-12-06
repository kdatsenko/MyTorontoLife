var express = require('express');
var router = express.Router();

var middleware = require('../middleware');
var checkAdmin = middleware.checkAdmin;

var models = {};
models.Groups = require('mongoose').model('Groups');
models.HashTags = require('mongoose').model('Hashtags');
models.GroupMembers = require('mongoose').model('GroupMembers');
models.Posts = require('mongoose').model('Posts');

/*
Get Hash Tags (Hash tag index)
There are two parameters, use_count, and date_last_used. Which takes precedent?
For now, I'll use date_last_used first, get tags used less than 100 days ago, order
by use_count descending, and extract the top 100 of the list.
*/
router.get('/', function(req, res) {

  var cutoff = new Date();
  cutoff.setDate(-100);
  models.HashTags.
  find({}).
  where('last_used').gt(cutoff).
  sort({ count: -1 }).
  limit(100).
  select('name last_used count').
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
      models.GroupMembers.find({user: req.session.user._id, group: {$nin : ids_public}}, {_id: 1}, function(err, docs){
        var ids_private = docs.map(function(doc) { return doc.group; });
        var merged_group_ids = ids_public.concat(ids_private);
        models.Posts.
        find({'hashtags.name' : { "$in" : [req.query.tagname]}, group: {"$in" : merged_group_ids}}).
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
        sort({ date_posted: -1 }).
        limit(100).
        select('post_type group short_text username userid date_posted averagerating interest hashtags numberofratings').
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
