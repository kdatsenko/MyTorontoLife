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
var auth = require('./routes/auth')



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



app.use(session({resave: true, saveUninitialized: true, secret: '25jh345hj34b7h8f', cookie: { maxAge: null}}));
app.use(passport.initialize());
app.use(passport.session());


app.use('/', routes);
app.use('/auth', auth);




app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});








module.exports = app;



/**
 * A simple authentication middleware for Express.
 *
 * Global Middleware that checks for a session on every request
 * and sets req.user to user if the user is logged in.
 */
 app.use(function(req, res, next) {
  if (req.session && req.session.user) {
    models.Users.findOne({ _id: req.session.user.id }, function(err, cleanUser) {
      if (cleanUser) {
        req.session.user = cleanUser; //refresh the session value
      	req.user = cleanUser;
      	res.locals.user = cleanUser;
      }
      // finishing processing the middleware and run the route
      next();
  });
  } else {
    next();
  }
 });


/**
 * Ensure a user is logged in before allowing them to continue their request.
 *
 * If a user isn't logged in, they'll be redirected back to the login page.
 */
 function requireLogin (req, res, next) {
  if (!req.user) { //Checks if a user is logged in or not
    req.session.reset();
    res.redirect('/');
  } else {
    next();
  }
};

/**
 * Check the user's session to confirm that they have Admin status.
 * Used for authentication for certain sensitive actions with the DB.
 * Pass admin_type as 0 or 1 for super or admin depending on action.
 */
 function checkAdmin(request, response, admin_type) {
  if (request.session && request.session.user) {
    if (admin_type == request.session.user.accounttype){
      return true;
    } else {
      console.log('User is not an administrator. ' + admin_type + ' ' + request.session.user.accounttype);
      return false;
    }
  } else {
    console.log('User is not an administrator: Session DNE.');
    return false;
  }
 };


/* Get user profile */
app.get('/users/profile', requireLogin, function(req, res) {
      models.Users.findOne({ username: req.query.username }, '-password')
      .populate({
      path: 'interests',
      //populate: { path: 'interests' }
      })
      .exec(function(err, user) {
        if (err) {
          return res.send(err);
        }
        if (!user){
          return res.status(404).send({error: 'User not found'});
        }
        res.json(user);
      });
});


// create, update, changepassword, upload image


/* Edit the user's profile */
app.put('/users/profile', requireLogin, function(req, res){
  //Action allowed only for Admins, or the user's own profile (session check)
  if (!checkAdmin(req, res, 1) & !checkAdmin(req, res, 0) & !(req.session.user._id == req.body._id)){
    return res.status(403).send({error: 'Unauthorized account type'});
  }
  models.Users.findOne({ _id: req.body._id }, function(err, user) {
    if (err) {
      return res.send(err);
    }

    for (property in req.body) {
      user[property] = req.body[property];
    }

    // save the user profile details
    user.save(function(err) {
      if (err) {
        return res.send(err);
      }
      res.json({ message: 'User profile updated!' });
    });

  });
});



/* Update the user's password. */
app.put('/users/profile/passwordchange', requireLogin, function(req,res){
//var changePassword = function (user){ //Require login
  if (checkAdmin(req, res, 1) | checkAdmin(req, res, 0)){
    changePasswordRegular(req.body, res); //req, res
  } else if (req.session.user._id == req.body._id){
    changePasswordAdmin(req.body, res); //req, res
  } else {
    return res.status(403).send({error: 'Unauthorized account type'});
  }
});


//Can bypass old password confirmation and change password directly
var changePasswordAdmin = function (user, res){
  //Action allowed only the user's own profile (session check)
  models.Users.findOne({ _id: user._id }, function(err, update_user) {
    if (err) {
      return res.send(err);
    }
    update_user.password = user.new_password;
    // save the user's new password to DB
    update_user.save(function(err) {
      if (err) {
        return res.send(err);
      }
      res.json({message: "Password successfully updated." });
    });
  });
};

//Can expect a old password confirmation check
var changePasswordRegular = function (user, res){
  //Action allowed only for Admins
  models.Users.findOne({ _id: user._id }, function(err, update_user) {
    if (err) {
      return res.send(err);
    }
    if (update_user.password != user.old_password){
      return res.status(422).send({error: 'Incorrect password submission.'});
    }
    update_user.password = user.new_password;
    // save the user's new password to DB
    update_user.save(function(err) {
      if (err) {
        return res.send(err);
      }
      res.json({message: "Password successfully updated." });
    });
  });
};



//upload image
/** Uploads an image file to the server, tranfers it to public/images folder,
 *  update the DB profile imageurl for this user.
 */
/* app.post('/fileupload', requireLogin, multipartyMiddleware, function(req, res) {
  if (!checkAdmin(req, res, 1) & !checkAdmin(req, res, 0) & !(req.session.user.email == req.body.email)){
    return res.status(403).send({error: 'Unauthorized account type'});
  }
  var file = req.files.file;
  console.log(file.name);
  console.log(file.type);
  console.log(file.path);

    // get the temporary location of the file
    var tmp_path = file.path;
    // set where the file should actually exists - in this case it is in the "images" directory
    var target_path = './public/images/' + file.name;
    var relpath_html = '../images/' + file.name;

    // move the file from the temporary location to the intended location
    fs.rename(tmp_path, target_path, function(err) {
      if (err)
        return res.send(err);
        // delete the temporary file, so that the explicitly set temporary
        //upload dir does not get filled with unwanted files
        fs.unlink(tmp_path, function() {
          if (err) return res.send(err);
          res.send({relpath: relpath_html});
        });
        //Modify the DB to include the right link
        models.User.findOne({ email: req.body.email }, function(err, user) {
          if (err)
            return console.log(err);
        user.imageurl = relpath_html; //change image link
        // save the user
        user.save(function(err) {
          if (err) {
            return console.log(err);
          }
          console.log("User " + user.email + " image updated!");
        });
    });
    });

});*/

/* Get all a list of all users' email, username (for Admin) */
 app.get('/users', requireLogin, function(req, res) {
  //Retrieve entire list from DB
  if (!checkAdmin(req, res, 1) & !checkAdmin(req, res, 0)){
    return res.status(403).send({error: 'Unauthorized account type'});
  }
  models.Users.find({}, '_id email username', function(err, users) {
    if (err) {
      return res.send(err);
    }
    res.json(users);
    });
});

/* getGroupByID */
app.get('/groups/group', requireLogin, function(req, res) {
  //if admin, go ahead
  //Check group privacy, and members of the group => if user included, display
  models.Groups.findOne({ _id: req.query._id }, function(err, found_group) {
    if (err) {
      return res.send(err);
    } else if (!found_group){
      return res.status(404).send({error: 'The group with id ' + req.query._id + ' does not exist'});
    }
    if (!checkAdmin(req, res, 1) & !checkAdmin(req, res, 0) & (found_group.private_type == true)){
      models.GroupMembers.findOne({user: req.session.user.id, group: req.query._id}, function(err, usergroup) {
        if (err) {
          return res.send(err);
        }
        if (!usergroup){
          return res.status(403).send({error: 'Group access for this user is unauthorized'});
        } else {
          res.json(found_group);
        }
      });

    } else {
      res.json(found_group);
    }

  });
});


/* getAllGroups */
 app.get('/groups', requireLogin, function(req, res) {
/*
1. If user is admin, get all
2. If user is not admin, get only public & those they signed up for (private - todo)
*/
  //Retrieve entire list from DB
  //Authenticate the current user for Admin Status
  if (!checkAdmin(req, res, 1) & !checkAdmin(req, res, 0)){
      models.Groups.aggregate(
      {$project: {name: 1, short_description: {$substr : ["$description", 0, 100]}}},
      {$match: {private_type: false}},
      function(err, groups) {
        if (err) { return res.send(err); }
        res.json(groups);
      });
  } else { //Get only those that are non-private
      models.Groups.aggregate(
      {$project: {name: 1, short_description: {$substr : ["$description", 0, 100]}}},
      function(err, groups) {
        if (err) { return res.send(err); }
        res.json(groups);
      });
  }
});

/* Get all this user's groups */
 app.get('/users/user/groups', requireLogin, function(req, res) {
  //get groups related to this user
  /*
1. Get all thi's user's group
UserGroups - for this userid, get all the groupids, populate with group name, and id
[ { group: { name: 'Toronto', _id: 5658ed81876352c41cb95891 } },
  { group: { name: 'Etobicoke', _id: 5658ed81876352c41cb95892 } },
  { group: { name: 'Little Italy', _id: 5658ed81876352c41cb95893 } } ]
  */
      models.GroupMembers.find({ user: req.session.user.id}, '-_id -user')
      .populate('group', 'name')
      .exec(function(err, groups) {
        if (err){
          return res.send(err);
        }
        res.json(groups);
        //send as res
      });
});

/* Create a new group */
app.post('/groups/addnew', requireLogin, function(req, res) {
  var group = new models.Group(req.body.group); //create new
  models.Groups.findOne({name: group.name}, function(err, found_group) { //name should be unique
          if (!found_group) { //There couldn't be found an Existing Group with this name
              group.group_creator = req.session.user.id; //this user
              group.save(function(err) {
                  if (err) {
                      res.send(err); //ERROR
                  }
                  res.status(200).send({message: 'Created group successfully'});

              });
          } else {
            return res.status(401).send({error: "That group name is already taken."});
          }
      }); //FINDONE
});

/* Update group - only group creator can do this. */
app.put('/groups/group', requireLogin, function(req, res){
  models.Groups.findOne({ _id: req.body._id }, function(err, group) {
    if (err) {
      return res.send(err);
    }
    if (!checkAdmin(req, res, 1) & !checkAdmin(req, res, 0) & !(req.session.user.id == group.group_creator)){
      return res.status(403).send({error: 'Unauthorized account type'});
    }

    for (property in req.body) {
      group[property] = req.body[property];
    }

    //check if a group with this name already exists (cannot repeat names!)
    models.Groups.findOne({ _id: {$ne: req.body._id}, name: group.name} , function(err, group) {
        if (err) {res.send(err); }
        if (!group){ //group with new does not already exist
            // save the group details
            group.save(function(err) {
              if (err) {
                return res.send(err);
              }
              res.json({ message: 'Group updated!' });
            });
        } else {
          return res.status(401).send({error: "That Group name is already taken, please try another."});
        }

    });

  });

});


//add Join Group ---- need
//if group creator is not the req.id, then we know what type of request it is


app.post('/groups/group/addmember', requireLogin, function(req, res){
    models.Groups.findOne({ _id: req.body.group._id }, function(err, group) {
      if (err){
        return res.send(err);
      } else if (!group){
        return res.status(404).send({error: 'The group with id ' + req.body.group._id + ' does not exist'});
      }
      if (group.private_type == true & group.group_creator == req.session.user.id){
        addGroupMember(req, res, group);
      } else if (group.private_type == false){
        joinGroup(req, res, group);
      } else {
        return res.status(403).send({error: 'Private group: Unauthorized account type'});
      }
    });

});

var joinGroup = function (req, res, group){ //requireLogin
    models.GroupMembers.findOneAndUpdate({user: req.session.user.id, group: group._id},
        {user: req.session.user.id, group: group._id}, { upsert: true }, function(err, membership){
      res.json({ message: 'Joined group!', result: membership});
    });
};

//group creator add member
var addGroupMember = function (req, res, group){
    //req.body.user._id = id of user to add in req JSON body
    models.GroupMembers.findOneAndUpdate({user: req.body.user._id, group: group._id},
      {user: req.body.user._id, group: group._id}, { upsert: true }, function(err, membership){
      res.json({ message: 'Joined group!', result: membership});
    });
};


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
 * Delete the user's record from the DB system.
 */
app.delete('/users/profile/:id', requireLogin, function(req, res) {
  if (!checkAdmin(req, res, 1) & !checkAdmin(req, res, 0)){ //Action only allowed for Admins.
    return res.status(403).send({error: 'Unauthorized account type'});
  }
  models.Users.findById(req.params.id, function(err, user){
      user.remove(function(err, user) {
      if (err) {
        return res.send(err);
      } else if (user && user.result.n > 0){
        res.json({ message: 'User ' + req.params.id + ' deleted!' });
      } else {
        res.json({ message: 'Unable to delete this user' });
      }
    });
  });
});

/**
 * Delete this group from the DB system.
 */
app.delete('/groups/group/:id', requireLogin, function(req, res) {
  if (!checkAdmin(req, res, 1) & !checkAdmin(req, res, 0)){ //Action only allowed for Admins.
    return res.status(403).send({error: 'Unauthorized account type'});
  }
  models.Groups.findById(req.params.id, function(err, group){
      if (!checkAdmin(req, res, 1) & !checkAdmin(req, res, 0) & group.group_creator != req.session.user.id){ //Action only allowed for Admins.
        return res.status(403).send({error: 'Unauthorized account type'});
      }
      group.remove(function(err, group) {
      if (err) {
        return res.send(err);
      } else if (group && group.result.n > 0){
        res.json({ message: 'Group ' + req.params.id + ' deleted!' });
      } else {
        res.json({ message: 'Unable to delete this group' });
      }
    });

  });

});


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

/* Search Posts by Tagname. Get 100 most recent. */
app.get('/tags/tag/posts', requireLogin, function(req, res) {
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




/*
Get Hash Tags (Hash tag index)
There are two parameters, use_count, and date_last_used. Which takes precedent?
For now, I'll use date_last_used first, get tags used less than 100 days ago, order
by use_count descending, and extract the top 100 of the list.
*/
app.get('/tags', requireLogin, function(req, res) {
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
app.get('/dashboard', requireLogin, function(req, res) {
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
