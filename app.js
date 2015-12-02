var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var moment = require('moment');
moment().format();
var session = require('express-session');
var passport = require('passport');
var models = require('./models/dbschema');
var ObjectId = mongoose.Types.ObjectId;
var app = express();

//mongoose.connect('mongodb://localhost/csc309a5'); // connect to our database

var dbName = 'A5DB';
var connectionString = 'mongodb://localhost:27017/' + dbName;

mongoose.connect(connectionString, function(err) {
  if(err) {
    console.log('connection error', err);
  } else {
    console.log('connection successful');
    var interest_ids = [new ObjectId, new ObjectId, new ObjectId, new ObjectId, new ObjectId, new ObjectId];

 var interests = [{_id: interest_ids[0], name: 'Food'},
                  {_id: interest_ids[1], name: 'Bars'},
                  {_id: interest_ids[2], name: 'Condo'},
                  {_id: interest_ids[3], name: 'Parks and Recreation'},
                  {_id: interest_ids[4], name: 'Hockey'},
                  {_id: interest_ids[5], name: 'Cat Cafe'}];

  var postTypes = [{_id: 7, name: 'Announcement'},
                  {_id: 8, name: 'Question'},
                  {_id: 9, name: 'Business Ad'},
                  {_id: 10, name: 'Event'},
                  {_id: 11, name: 'Sale Listing'},
                  {_id: 12, name: 'Poll'}];

  var groups = [{_id: 13, name: 'Toronto'},
                  {_id: 14, name: 'Etobicoke'},
                  {_id: 15, name: 'Little Italy'},
                  {_id: 16, name: 'Kensington'},
                  {_id: 17, name: 'Guelph'},
                  {_id: 18, name: 'Old Mill'},
                  {_id: 19, name: 'Marys Housemates'},
                  {_id: 20, name: 'Distillery District'}];

 var users = [
 { email: 'hello@fromtheotherside.com',
  password: 'dddd',
  accounttype: 2, //0 for Super Admin, 1 for Admin, 2 for user
  loggedin: 0,
  username: 'Adele',
  description: '25 now',
  //validation between 10 and 200 (vampires!)
  age: 25,
  gender: 'female', //for aliens!
  homeaddress: 'London',
  workplace: 'Some label',
  position: 'Songstress',
  contactinfo: 'Forget it',
  interests: [interest_ids[0], interest_ids[2]]},

  { email: 'borntodie@lana.com',
  password: 'dddd',
  accounttype: 1, //0 for Super Admin, 1 for Admin, 2 for user
  loggedin: 0,
  username: 'LanaDelRey',
  description: 'Off to the races!',
  //validation between 10 and 200 (vampires!)
  age: 25,
  gender: 'female', //for aliens!
  homeaddress: 'USA',
  workplace: 'Some label',
  position: 'Songstress',
  contactinfo: 'Forget it',
  interests: [interest_ids[0], interest_ids[2]]
}];


 models.Interests.collection.insert(interests, onInsert);
 models.Users.collection.insert(users, onInsert)
 models.Types.collection.insert(postTypes, onInsert);
 models.Groups.collection.insert(groups, onInsert);


 test();

  }

});

  function onInsert(err, docs) {
    if (err) {
        // TODO: handle error
    } else {
      console.log(docs);
        console.log(docs.insertedCount + ' entries were successfully stored.');
    }
  }


var routes = require('./routes/index');



// view engine setup
/*var exphbs = require('express-handlebars');
app.engine('.hbs', exphbs({defaultLayout: 'single', extname: '.hbs'}));
app.set('view engine', '.hbs');*/

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
//app.use(express.static(path.join(__dirname, 'public')));

app.use(express.static(path.join(__dirname + '/public')));
app.set('views', __dirname + '/public');
//app.engine('html', require('ejs').renderFile);
//app.set('view engine', 'html');

//app.use('/api/v1/', api);
app.use(session({resave: true, saveUninitialized: true, secret: '25jh345hj34b7h8f', cookie: { maxAge: null}}));

app.use(passport.initialize());
app.use(passport.session());



app.use('/', routes);


var middleware = require("./middleware");
var requireLogin = middleware.requireLogin;
var checkAdmin = middleware.checkAdmin;


/* Create new Interest (only Admins) */
app.post('/interests/addnew', requireLogin, function(req, res){
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

/* Get all Interests */
 app.get('/interests', requireLogin, function(req, res) {
  //Retrieve entire interest list from DB
  models.Interests.find({}, function(err, interests) {
    if (err) {
      return res.send(err);
    }
    res.json(interests);
    });
});

/* Create Post, update hashtags */
app.post('/posts/addnew', requireLogin, function(req, res){
//for each new hashtag, create new entry in the hashtag schema
    //if member is a user of that group, or an admin, then they can create the post
    models.GroupMembers.findOne({user: req.session.user.id, group: req.body.post.group}, function(err, usergroup) {
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
app.get('/posts/post', requireLogin, function(req, res) {
    models.Posts.findOne({ _id: req.query._id })
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
        models.GroupMembers.findOne({group: post.group, user: req.session.user.id}, function(err, user){
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
  models.PostRatings.findOne({userid: req.session.user.id, postid: post._id}, function(err, post_rating) {
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
app.put('/posts/post', requireLogin, function(req, res){
  //Hashtags: For each new create new entry in hashtag schema
   models.Post.findOne({ _id: req.body._id }, function(err, post) {
    if (err) {
      return res.send(err);
    } else if (!post){
      return res.status(404).send({error: 'Post does not exist.'});
    }
    if (post.userid == req.session.user.id){ //check if postcreator is is the user
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


/* Get all Post Types */
 app.get('/posttypes', requireLogin, function(req, res) {
  //Retrieve entire post types list from DB
    models.PostTypes.find({}, function(err, types) {
    if (err) {
      return res.send(err);
    }
    res.json(types);
    });
});


/* User add a comment to a post.*/
app.post('/posts/post/addcomment', requireLogin, function(req, res){
  //to post a comment, user must be a member of the group
  models.GroupMembers.findOne({user: req.session.user.id, group: req.body.comment.group}, function(err, usergroup) {
        if (err) {
          return res.send(err);
        }
        if (!usergroup){
          return res.status(403).send({error: 'Commenting on this post is unauthorized for this user'});
        } else {
          var commentObj = {
            userid: req.session.user.id,
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



/* Create new Interest (only Admins) */
app.post('/interests/addnew', requireLogin, function(req, res){
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

/* Rate the post */
app.post('/posts/post/rate', requireLogin, function(req, res){
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
    } else if (post.userid == req.session.user.id) {
      return res.status(403).send({error: "A user cannot rate their own post"});
    }
    models.GroupMembers.findOne({user: req.session.user.id, group: req.body.rating.groupid}, function(err, usergroup) {
      if (err){
        return res.send(err);
      } else if (!usergroup){
        return res.status(403).send({error: 'Rating on this post is unauthorized for this user.'});
      }
        //check that a rating does not already exist this user and post id
        models.PostRatings.findOne({postid: post._id, userid: req.session.user.id}, function(err, post_rating) {
          if(err){
            return res.send(err);
          }
          else if (!post_rating){ //a rating by this user for this post does not exist yet
            //CREATE NEW
            var in_rating = new models.PostRatings({postid: post._id,
                                                      userid: req.session.user.id,
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
app.delete('/posts/post/:id', requireLogin, function(req, res) {
  models.Posts.findById(req.params.id, function(err, post){
      if (!checkAdmin(req, res, 1) & !checkAdmin(req, res, 0) & post.userid != req.session.user.id){ //Action only allowed for Admins.
        return res.status(403).send({error: 'Unauthorized account type'});
      }
      post.remove(function(err, post) {
      if (err) {
        return res.send(err);
      } else if (post && post.result.n > 0){
        res.json({ message: 'Post' + req.params.id + ' deleted!' });
      } else {
        res.json({ message: 'Unable to delete this post' });
      }
    });
  });
});


/* Get Group Posts */
app.get('/groups/group/posts', requireLogin, function(req, res) {
//auth: only groups where the user is a member, or public
 models.Group.findById(req.query.groupid, function(err, group){
    if (!checkAdmin(req, res, 1) & !checkAdmin(req, res, 0)){
      if (err){
        return res.send(err);
      } else if (group.private_type){
        models.GroupMembers.findOne({user: req.session.user.id, group: req.query.groupid}, function(err, usergroup) {
          if (err){
            return res.send(err);
          } else if (!usergroup){
            return res.status(403).send({error: 'Unauthorized account type'});
          }
          getGroupPosts(req, res, group);
        });
      } //else PUBLIC group, goes to bottom function
    }
    getGroupPosts(req, res, group);
  });

});

/* Get 100 most recent posts for this group. Authen. is done in wrapper rest api method. */
var getGroupPosts = function (req, res, group){
    models.Posts.
    find({group:  group._id}).
    limit(100).
    sort({ date_posted: -1 }).
    select('post_type group short_text username userid date_posted averagerating numberofratings').
    exec(function(err, posts){
      if (err){
        return res.send(err);
      }
      return res.json(posts);
    });
};





/*
1. Get Posts By Interest.
2. Where the post group is public, or the user is member of that group
3. Order by most recent date, rating, get top 100 first
*/
app.get('/interests/interest/posts', requireLogin, function(req, res) {

  models.Interests.findOne({_id: req.query.interest.id, name: req.query.interest.name}, function (err, found_interest){
    if (err){
      return res.send(err);
    } else if(!found_interest){
      return res.status(404).send({error: 'Interest ' + req.query.interest.name + ' does not exist.'});
    }
    models.Groups.find({private_type: false}, {_id: 1}, function(err, docs) {

      // Map the docs into an array of just the _ids
      var ids_public = docs.map(function(doc) { return doc._id; }); //all the public group ids
      models.GroupMembers.find({user: req.session.user.id, group: {$nin : ids_public}}, {_id: 1}, function(err, docs){

        var ids_private = docs.map(function(doc) { return doc.group; });
        var merged_group_ids = ids_public.concat(ids_private);

        models.Posts.
        find({group: { "$in" : merged_group_ids}, interest: found_interest._id}).
        sort({date_posted: -1}).
        limit(100).
        select('post_type group short_text username userid date_posted averagerating numberofratings').
        exec(function(err){
          if (err) {
            return res.send(err);
          }
          return res.json(posts);
        });

    });

   });

  });
});


// Let angular handle everything else
app.get(function(req, res){
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});





function test () {
  console.log('Hello we are sitting with me!');
  var post = {
    _id: postids[0]
  };
  //mainFeed();
  //getUser('Adele');
  //searchByGroup();

}

module.exports = app;

/**
- Connection to DB, put in early data

- Few statements that extract data from multiple tables.
- interest join with user
-

Person.find().populate('teamId').exec(function(err, people) {
  ...
});

app.post('/signup', function(req, res) {

*/

var getUser = function (username){
      models.Users.findOne({ username: username })
      .populate({
      path: 'interests',
      //populate: { path: 'interests' }
      })
      .exec(function(err, user) {
        console.log(err);
        console.log(user);
      });


};

function test () {
  console.log('Hello we are sitting with me!');
  getUser('Adele');
}
