var express = require('express');
var router = express.Router();

var middleware = require('../middleware');
var checkAdmin = middleware.checkAdmin;


var models = {};
models.Users = require('mongoose').model('Users');
models.GroupMembers = require('mongoose').model('GroupMembers');
models.HashTags = require('mongoose').model('Hashtags');
models.Posts = require('mongoose').model('Posts');
models.PostRatings = require('mongoose').model('PostRatings');


router.get('/', function(req, res){
   if (checkAdmin(req, res, 1) | checkAdmin(req, res, 0)){
      models.Posts.find({})
      .populate({
      path: 'post_type',
      select: 'name'
      })
      .populate({
      path: 'group',
      select: 'name'
      //populate: { path: 'interests' }
      })
      .select('_id post_type group short_text username userid date_posted')
      .exec(function(err, posts) {
        if (err){
          return res.send(err);
        } else if (!posts){
          return res.status(404).send({error: 'Posts are not found'});
        }
        return res.json(posts);
      });
  } else {
    return res.status(403).send({error: 'Unauthorized account type'});
  }

});



/* The posts page shows a single post. */
/* Create Post, update hashtags */
router.post('/addnew', function(req, res){
//for each new hashtag, create new entry in the hashtag schema
    //if member is a user of that group, or an admin, then they can create the post
    models.GroupMembers.findOne({user: req.session.user._id, group: req.body.post.group}, function(err, usergroup) {
      if (err) {
        return res.send(err);
      }
      if (!usergroup){
        return res.status(403).send({error: 'Group access for this user is unauthorized'});
      } else {
        var post = new models.Posts(req.body.post); //create new
        post.username = req.session.user.username;
        post.userid = req.session.user.userid;
        var hashtags = [];
        var time_inserted = Date.now();
        for (tag in input.hashtags){
          //promise with exec() for asynch behaviour
          var tagid = models.Hashtags.findOneAndUpdate({name: tag}, {last_used: time_inserted, count: {$inc: 1}}, {'upsert': true}).exec();
          hashtags.push({tag_id: tagid, name: tag});
        }
        post.hashtags = hashtags;
        post.save(function(err) {
            if (err) {
                return res.send(err); //ERROR
            }
            res.json({ message: 'Created post!', result: post});

       });

    }
  });
});



/* Get Post by Id. While loading the post, also populate the hashtags.
Rights: admin, public or by private member
*/
router.get('/post', function(req, res) {
    models.Posts.findOne({ _id: req.query.id })
    .populate({
    path: 'post_type'
    //populate: { path: 'interests' }
    })
    .populate({
    path: 'group',
    select: 'name private_type'
    //populate: { path: 'interests' }
    })
    .populate({
    path: 'interest',
    select: 'name'
    //populate: { path: 'interests' }
    })
    .select('-fivestarcount -fourstarcount -threestarcount -twostarcount -onestarcount')
    .exec(function(err, post) {
      if (err){
        return res.send(err);
      } else if (!post){
        return res.status(404).send({error: 'Post not found'});
      }
      //Authorization check
      if (!checkAdmin(req, res, 1) & !checkAdmin(req, res, 0) & post.group.private_type){
        models.GroupMembers.findOne({group: post.group, user: req.session.user._id}, function(err, user){
          if (err){
            return res.send(err);
          } if (!user){
            return res.status(403).send({error: 'Unable to authenticate. Post viewing action not allowed for this user.'});
          }
          //when we get the post, also get the user's rating (if they did one)
          getPostRating(req, res, post);
        });

      } else {
          //when we get the post, also get the user's rating (if they did one)
          getPostRating(req, res, post);
      }

    });
});

/* Fill in the user's rating for this post */
var getPostRating = function (req, res, post){
  models.PostRatings.findOne({userid: req.session.user._id, postid: post._id}, function(err, post_rating) {
    if (err){
      return res.send(err);
    } else if (!post_rating){
      return res.json(post);
    }
    var postObj = post.toObject();
    post.user_rating = post_rating.user_rating;
    return res.json(post);
  });
};


/* Update Post */
router.put('/post', function(req, res){
  //Hashtags: For each new create new entry in hashtag schema
   models.Posts.findOne({ _id: req.body._id }, function(err, post) {
    if (err) {
      return res.send(err);
    } else if (!post){
      return res.status(404).send({error: 'Post does not exist.'});
    }
    if (post.userid == req.session.user._id){ //check if postcreator is is the user
      for (property in req.body) {
        post[property] = req.body[property];
      }
      var hashtags = [];
      var time_inserted = Date.now();
      for (tag in input.hashtags){
        //promise with exec() for asynch behaviour
        var tagid = models.Hashtags.findOneAndUpdate({name: tag}, {last_used: time_inserted, count: {$inc: 1}}, {'upsert': true}).exec();
        hashtags.push({tag_id: tagid, name: tag});
      }
      post.hashtags = hashtags;
      post.save(function(err) {
        if (err) {
          return res.send(err);
        }
        res.json({ message: 'Post updated!', result: post});
      });
    } else {
      return res.status(403).send({error: 'Unauthorized post update'});
    }
  });
});

/* User add a comment to a post.*/
router.post('/post/addcomment', function(req, res){
  //to post a comment, user must be a member of the group
  models.GroupMembers.findOne({user: req.session.user._id, group: req.body.comment.group}, function(err, usergroup) {
        if (err) {
          return res.send(err);
        }
        if (!usergroup){
          return res.status(403).send({error: 'Commenting on this post is unauthorized for this user'});
        } else {
          var commentObj = {
            userid: req.session.user._id,
            username: req.session.user.username,
            text: req.body.comment.text
          };
          //update the post comment array
          models.Posts.findByIdAndUpdate(
          req.body.comment.postid,
          {$push: {comments: commentObj}},
          {safe: true, upsert: true},
          function(err, comment) {
            if (err){
               return res.send(err);
            }
            res.json({ message: 'Comment added!', result : comment});
          });
        }
    });
});

/* Rate the post */
router.post('/post/rate', function(req, res){
  //number from 1-5 check
  //check that a rating does not already exist this user and post id
  //if it does, just update the number
  //check that the user is a member of post's group first
  if (req.body.rating.stars < 1 | req.body.rating.stars > 5){
    return res.status(403).send({error: "Rating is out of bounds!"});
  }
  //update the post five stars, four stars, etc
  models.Posts.findById(req.body.rating.postid, function(err, post){
    if (err){
      return res.send(err); //ERROR
    } else if (!post){
      return res.status(403).send({error: "Cannot authorize action rating: Post ref does not exist"});
    } else if (post.userid == req.session.user._id) {
      return res.status(403).send({error: "A user cannot rate their own post"});
    }
    models.GroupMembers.findOne({user: req.session.user._id, group: req.body.rating.groupid}, function(err, usergroup) {
      if (err){
        return res.send(err);
      } else if (!usergroup){
        return res.status(403).send({error: 'Rating on this post is unauthorized for this user.'});
      }
        //check that a rating does not already exist this user and post id
        models.PostRatings.findOne({postid: post._id, userid: req.session.user._id}, function(err, post_rating) {
          if(err){
            return res.send(err);
          }
          else if (!post_rating){ //a rating by this user for this post does not exist yet
            //CREATE NEW
            var in_rating = new models.PostRatings({postid: post._id,
                                                      userid: req.session.user._id,
                                                      rating: req.body.rating.stars}); //create new
            in_rating.save(function(err) { //SAVE NEW
              if (err) {
                return res.send(err);
              }
              res.json({ message: 'New rating saved!' });
            });
          } else {
            //UPDATE OLD RATING
             modifyPostRatingHelper(post, post_rating.rating, true);
             post_rating.rating = req.body.rating.stars; //new num stars
             post_rating.save(function(err) {
                if (err) {
                  return res.send(err);
                }
                res.json({ message: 'User rating for this post updated!' });
             });
          }

          modifyPostRatingHelper(post, req.body.rating.stars, false);
          calculateAverageRating(post);
          post.save(function(err) {
            if (err) {
              return res.send(err);
            }
            console.log('Post rating count updated!');
          });
        });

    });
  });
});

/* Recalculate average rating for this post */
var calculateAverageRating = function(postObj){
  var total = (postObj.onestarcount * 1) +
              (postObj.twostarcount * 2) +
              (postObj.threestarcount * 3) +
              (postObj.fourstarcount * 4) +
              (postObj.fivestarcount * 5);
  postObj.averagerating = (total / numberofratings);
};

/* -1: subtract=true, +1: substract=false*/
var modifyPostRatingHelper = function(postObj, numstars, subtract){
  var increment;
  if (subtract) {
    increment = -1;
  } else {
    increment = 1;
  }
  switch (numstars) {
    case 1:
        postObj.onestarcount += increment;
        break;
    case 2:
        postObj.twostarcount += increment;
        break;
    case 3:
        postObj.threestarcount += increment;
        break;
    case 4:
        postObj.fourstarcount += increment;
        break;
    case 5:
        postObj.fivestarcount += increment;
        break;
  }
  postObj.numberofratings += increment;
};






/**
 * Delete this Post from the DB system.
 */
router.delete('/post/:id', function(req, res) {
  models.Posts.findById(req.params.id, function(err, post){
      if (err) {return res.send(err);}
      if (!post) {
        return res.json({message: 'Post not found'});
      }
      if (!checkAdmin(req, res, 1) & !checkAdmin(req, res, 0) & post.userid != req.session.user._id){ //Action only allowed for Admins.
        return res.status(403).send({error: 'Unauthorized account type'});
      }
      post.remove(function(err, post) {
      if (err) {
        return res.send(err);
      } else if (post){
        res.json({ message: 'Post' + req.params.id + ' deleted!' });
      } else {
        res.json({ message: 'Unable to delete this post' });
      }
    });
  });
});



module.exports = router;
