var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
//<<<<<<< HEAD
//var session = require('client-sessions');
var moment = require('moment');
moment().format();
//=======
var session = require('express-session');
var passport = require('passport')
//>>>>>>> origin/adam

var models = require('./models/dbschema');
var ObjectId = mongoose.Types.ObjectId;
var routes = require('./routes/index');
var auth = require('./routes/auth')

var app = express();

// view engine setup
var exphbs = require('express-handlebars');
app.engine('.hbs', exphbs({defaultLayout: 'single', extname: '.hbs'}));
app.set('view engine', '.hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({resave: true, saveUninitialized: true, secret: '25jh345hj34b7h8f', cookie: { maxAge: null}}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', routes);
app.use('/auth', auth);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;

//mongoose.connect('mongodb://localhost/csc309a5'); // connect to our database

var dbName = 'A5DB';
var connectionString = 'mongodb://localhost:27017/' + dbName;


var user_ids = [new ObjectId, new ObjectId];
  var group_ids = [new ObjectId, new ObjectId, 
                  new ObjectId, new ObjectId,
                  new ObjectId, new ObjectId,
                  new ObjectId, new ObjectId];
var postids = [new ObjectId, new ObjectId, new ObjectId];
    var interest_ids = [new ObjectId, new ObjectId, new ObjectId, new ObjectId, new ObjectId, new ObjectId];

mongoose.connect(connectionString, function(err) {
  if(err) {
    console.log('connection error', err);
  } else {
    console.log('connection successful');


 var interests = [{_id: interest_ids[0], name: 'Food'},
                  {_id: interest_ids[1], name: 'Bars'},
                  {_id: interest_ids[2], name: 'Condo'},
                  {_id: interest_ids[3], name: 'Parks and Recreation'},
                  {_id: interest_ids[4], name: 'Hockey'},
                  {_id: interest_ids[5], name: 'Cat Cafe'}];

  var types = [new ObjectId, new ObjectId, new ObjectId, new ObjectId, new ObjectId, new ObjectId];
  var postTypes = [{_id: types[0], name: 'Announcement'},
                  {_id: types[1], name: 'Question'},
                  {_id: types[2], name: 'Business Ad'},
                  {_id: types[3], name: 'Event'},
                  {_id: types[4], name: 'Sale Listing'},
                  {_id: types[5], name: 'Poll'}];



  var groups = [{_id: group_ids[0], name: 'Toronto', group_creator: user_ids[0], description: "Groups - I assume we will preload some groups. How does the user belong to a group? Can they choose any group to join? Are there public and private groups? Will the user only see posts for the groups that they are registered with? Right now, I have set it so that all groups are by default public, and I was thinking that if a group is private then users already in the group have the privilege to add others. search and rate things in neighbourhood Toronto overall. Does this mean search and rate posts in the group the user belongs to? Site events? Page views I understand, but what else goes into this? Post expiry date - why do we need it? What happens to the post after expiry? I am concerned because there are tuples in other tables that depend on the post, and reputation of the user is aggregated based on ratings on their posts, so we shouldn’t remove the posts. How to calculate the user’s reputation? Example: there could be 1 post with a five star rating made by one user. On the other hand, there could be a post where 100 users voted. Also, some users have only a few posts, while others have multiple. So I was thinking what if we will create some formula based on numbers of posts and 5, 4, … 1 rating counts, number of votes. "},
                  {_id: group_ids[1], name: 'Etobicoke', group_creator: user_ids[0], description: "hello my kitty!"},
                  {_id: group_ids[2], name: 'Little Italy', group_creator: user_ids[0]},
                  {_id: group_ids[3], name: 'Kensington', group_creator: user_ids[0]},
                  {_id: group_ids[4], name: 'Guelph', group_creator: user_ids[0], description: "Post expiry date - why do we need it? What happens to the post after expiry? I am concerned because there are tuples in other tables that depend on the post, and reputation of the user is aggregated based on ratings on their posts, so we shouldn’t remove the posts. How to calculate the user’s reputation? Example: there could be 1 post with a five star rating made by one user. On the other hand, there could be a post where 100 users voted. Also, some users have only a few posts, while others have multiple. So I was thinking what if we will create some formula based on numbers of posts and 5, 4, … 1 rating counts, number of votes. "},
                  {_id: group_ids[5], name: 'Old Mill', group_creator: user_ids[0]},
                  {_id: group_ids[6], name: 'Marys Housemates', group_creator: user_ids[0]},
                  {_id: group_ids[7], name: 'Distillery District', group_creator: user_ids[0]}];

  var usergroups = [{user: user_ids[0], group: group_ids[0]}, {user: user_ids[0], group: group_ids[1]}, 
  {user: user_ids[0], group: group_ids[2]},
  {user: user_ids[1], group: group_ids[1]}, {user: user_ids[1], group: group_ids[3] }];




var posts = [
{
  _id: postids[1],
  post_type: types[0],
  group: group_ids[0],
  text: 'Hello, Hello!',
  username: 'Adele',
  userid: user_ids[0],
  date_posted: Date.now(),
  interest: interest_ids[0],
   fivestarcount: 1
},
{
  _id: postids[0],
  post_type: types[0],
  group: group_ids[0],
  text: 'Adelaida!!',
  username: 'Adele',
  userid: user_ids[0],
  interest: interest_ids[0],
   fivestarcount: 1
}
];

var ratings = [{
  postid: postids[0],
  userid: user_ids[1],
  rating: 5
}];


 var users1 = [
 {_id: user_ids[0], 
  email: 'hello@fromtheotherside.com',
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

  {_id: user_ids[1],
    email: 'borntodie@lana.com',
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
  interests: [interest_ids[0], interest_ids[4]]
}];

 console.log('users Adele!!!!!!!!!!!! ' + users1[0].interests);
 console.log('users Lana!!!!!!!!!!!! ' + users1[1].interests);

  
 models.Interests.collection.insert(interests, onInsert);
 models.Users.collection.insert(users1, onInsert)
 models.PostTypes.collection.insert(postTypes, onInsert);
 models.Groups.collection.insert(groups, onInsert);
 models.GroupMembers.collection.insert(usergroups, onInsert);
 models.Posts.collection.insert(posts, onInsert);
 models.PostRatings.collection.insert(ratings, onInsert);


/*var postinfo = {
  _id: postids[2],
  post_type: types[0],
  group: group_ids[0],
  text: 'Hello works!',
  short_text: 'g',
  username: 'Adele',
  userid: user_ids[0],
  interest: interest_ids[0],
   fivestarcount: 1
};
var post = new models.Posts(postinfo); //create new  
post.save(function(){
  models.Posts.find({}, function(err, posts){
    console.log(posts);
  });
});*/



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


//SESSION CODE ---------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------

app.use(session({
  cookieName: 'session',
  secret: 'blargadeeblargblarg' // should be a large unguessable string
}));


/**
 * A simple authentication middleware for Express.
 *
 * Global Middleware that checks for a session on every request 
 * and sets req.user to user if the user is logged in.
 */
 app.use(function(req, res, next) {
  if (req.session && req.session.user) {
    models.Users.findOne({ _id: req.session.user.id }, function(err, user) {
      if (user) {
        createUserSession(req, res, user);   
      } 
      // finishing processing the middleware and run the route
      next();
  });
  } else {
    next();
  }


 });

 /**
 * Given a user object:
 *
 *  - Store the user object as a req.user
 *  - Make the user object available to templates as #{user}
 *  - Set a session cookie with the user object
 *
 *  @param {Object} req - The http request object.
 *  @param {Object} res - The http response object.
 *  @param {Object} user - A user object.
 */
 function createUserSession(req, res, user) {
  var cleanUser = {
    id: user._id,
    email:  user.email,
    username: user.username,
    accounttype: user.accounttype //Exists to personalize user experience
  };
  req.session.user = cleanUser; //refresh the session value
  req.user = cleanUser;
  res.locals.user = cleanUser;
};


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

//PROFILE TODO: send to RESPONSE //RequireLogin
var getUserProfile = function (username){
      models.Users.findOne({ username: username }, '-password')
      .populate({
      path: 'interests',
      //populate: { path: 'interests' }
      })
      .exec(function(err, user) {
        console.log(err);
        console.log(user);
        //send as res
      });
};

/* Register this user and their profile. Profile must have some INTERESTS. Interest are ids. */
var createUser = function (user){
  // verify if the DB has any records
  // if yes, then verify if the user with this email or username already exists
  // if email already exists, return error
  // if not, create new regular user and return success response 
  var user = new models.Users(user); //create new  
  var error_msg;
  user.accounttype = 2; //regular user

  models.Users.find({$or:[ {'email': user.email}, {'username': user.username} ]}, function(err, found_users) {
          if (!found_users.length) { //THERE Couldn't be found a user with this email or username yet! 
              //new user credentials validated

              user.loggedin = true;
              user.save(function(err) {
                  if (err) {
                    console.log(err);
                    return;
                        //return res.send(err); //ERROR
                  }
                  //user id??? get from DB
                  createUserSession(req, res, user); //make a session
                  console.log("User Added");
                  
                  //res.status(200).send({message: 'Signed in user'});
                  //createUserSession(req, res, user); //make a session
                  //res.status(200).send({message: 'Signed in user'});

                  });

          } else { 
          //THERE EXISTS A USER WITH THIS EMAIL
          //return res.status(401).send({error: "That email is already taken, please try another."});
            console.log("Email or username already taken.");
          }
      }); //FIND END
};


//TODO: create a session
var loginUser = function (user){
  models.Users.findOne({ email: user.email}, function(err, found_user) { ///????
    if (err) { 
      console('Something went wrong');
      //res.status(500).send({error: 'Something went wrong'});
    } else if (!found_user){
          //THERE DOES NOT EXISTS A USER WITH THIS EMAIL & Password
          console.log('Invalid email or password');
          //res.status(401).send({error: 'Invalid email or password'});
      } else {
        if (found_user.password === user.password){ //validate login

            //SESSION HANDLING
            createUserSession(req, res, user);
            console.log('Logged in user');
            //res.status(200).send({message: 'Logged in user'});

        } else {
          console.log('Invalid email or password');
          //res.status(401).send({error: 'Invalid email or password'});
        }
    }
  });
};








// create, update, changepassword, upload image


/* Edit the user's profile */
var updateUser = function (user){ //requireLogin
  //Action allowed only for Admins, or the user's own profile (session check)
  if (!checkAdmin(req, res, 1) & !checkAdmin(req, res, 0) & !(req.session.user.email == user.email)){
    console.log('Unauthorized account type');
    return;// res.status(403).send({error: 'Unauthorized account type'});
  }
  models.Users.findOne({ _id: user._id }, function(err, user) {
    if (err) {
      console.log(err);
      return;
      //return res.send(err);
    }

    for (property in req.body) {
      user[property] = req.body[property];
    }

    // save the user profile details
    user.save(function(err) {
      if (err) {
        console.log(err);
        return;
        //return res.send(err);
      }
      console.log('User profile updated!');
      //res.json({ message: 'User profile updated!' });
    });

  });
};


var changePassword = function (user){ //Require login
  if (checkAdmin(req, res, 1) | checkAdmin(req, res, 0)){
    changePasswordRegular(user); //req, res
  } else if (req.session.user.email == user.email){
    changePasswordAdmin(user); //req, res
  } else {
    console.log('Unauthorized account type');
    return;// res.status(403).send({error: 'Unauthorized account type'});
  }
}

//Can expect a old password confirmation check
var changePasswordRegular = function (user){
  //Action allowed only the user's own profile (session check)
  models.Users.findOne({ _id: user._id }, function(err, update_user) {
    if (err) {
      //return res.send(err);
      console.log(err);
      return;
    }
    update_user.password = user.password;
    // save the user profile details
    update_user.save(function(err) {
      if (err) {
        console.log(err);
        return;
        //return res.send(err);
      }
      console.log('User profile updated!');
      //res.json({ message: 'User profile updated!' });
    });
  });
};

//Can bypass old password confirmation and change password directly
var changePasswordAdmin = function (user){
  //Action allowed only for Admins
  models.Users.findOne({ _id: user._id }, function(err, update_user) {
    if (err) {
      //return res.send(err);
      console.log(err);
      return;
    }
    if (update_user.password != user.old_password){
      console.log('Incorrect password submission.');
      return;// res.status(422).send({error: 'Incorrect password submission.'});
    }
    update_user.password = user.password;
    // save the user profile details
    update_user.save(function(err) {
      if (err) {
        console.log(err);
        return;
        //return res.send(err);
      }
      console.log('User profile updated!');
      //res.json({ message: 'User profile updated!' });
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


var getUsers = function(){ //requireLogin
  //Retrieve entire list from DB
  if (!checkAdmin(req, res, 1) & !checkAdmin(req, res, 0)){
    console.log('Unauthorized account type');
    return;// res.status(403).send({error: 'Unauthorized account type'});
  }
  models.Users.find({}, '_id email username', function(err, users) {
    if (err) {
      console.log(err);
      return;
      //return res.send(err);
    }
    // ONLY RETURN THE EMAIL AND DISPLAY NAME - empty or not!!!
    console.log(users);
    //res.json(users);
    });
};


var getGroupByID = function(group){ //requireLogin, replace console.log with ...
  //if admin, go ahead
  //Check group privacy, and members of the group => if user included, display
  models.Groups.findOne({ _id: group._id }, function(err, found_group) {
    if (err) {
      //return res.send(err);
      console.log(err);
      return;
    } else if (!found_group){
      console.log('The group with id ' + group._id + ' does not exist');
      return;
    }
    if (!checkAdmin(req, res, 1) & !checkAdmin(req, res, 0) & (group.private_type == true)){

      models.GroupMembers.findOne({user: req.session.user.id, group: group._id}, function(err, usergroup) {
        if (err) {
          //return res.send(err);
          console.log(err);
          return;
        }
        if (!usergroup){
          console.log('Group access for this user is unauthorized');
          return;
        } else {
          console.log(found_group);
        }
      });

    } else {
      console.log(found_group);
    }

  });  
};


//TODO: authenticate which user for private and non-private groups
var getAllGroups = function(){
/* 
1. If user is admin, get all
2. If user is not admin, get only public & those they signed up for
CANNOT: "those they signed up for"
*/
  //Retrieve entire list from DB
  //Authenticate the current user for Admin Status
  if (!checkAdmin(req, res, 1) & !checkAdmin(req, res, 0)){
    models.Groups.find({private_type: false}, '_id name short_description', function(err, groups) {
      if (err) {
        console.log(err);
        return;
      }
      console.log(groups);
          // ONLY RETURN THE EMAIL AND DISPLAY NAME - empty or not!!!
         // res.json(users);
    });

  } else {
    models.Groups.aggregate(
      {$project: {name: 1, short_description: {$substr : ["$description", 0, 100]}}},
      {$match: {private_type: false}},
      function(err, groups) {
        console.log(groups);
      });
  }

};


var getUserGroups = function(){
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
          console.log(err);
          return;
        }
        console.log(groups);
        //send as res
      });
};

//GROUPS update, create, admin create 
// who has right to update group? 
//Group creator? yes!

//create group 
var createGroup = function(group){ //requireLogin
  var group = new models.Group(group); //create new  
  models.Groups.findOne({name: group.name}, function(err, found_group) { //name should be unique
          if (!found_group) { //THERE Couldn't be found a user with this group name

              group.group_creator = req.session.user.id; //this user
              group.save(function(err) {
                  if (err) {
                      console.log(err);
                      return;// res.send(err); //ERROR
                  }
                  console.log(group);

              });
                
 

              } else { 
              //THERE EXISTS A USER WITH THIS EMAIL
              //return res.status(401).send({error: "That email is already taken, please try another."});
                console.log('That group name is already taken.');
              }   
      }); //FINDONE
};

// who has right to update group? 
//Group creator? yes!
var updateGroup = function (group){ //requireLogin

  models.Groups.findOne({ _id: group._id }, function(err, group) {
    if (err) {
      console.log(err);
      return; //return res.send(err);
    }
    if (!checkAdmin(req, res, 1) & !checkAdmin(req, res, 0) & !(req.session.user.id == group.group_creator)){
      console.log('Unauthorized account type');
      return;
    //return res.status(403).send({error: 'Unauthorized account type'});
    }

    for (property in req.body) {
      user[property] = req.body[property];
    }

    // save the user profile details
    group.save(function(err) {
      if (err) {
        return res.send(err);
      }
      res.json({ message: 'User profile updated!' });
    });

  });

};

var joinGroup = function (group){ //requireLogin
  // id, 

  //var group = new models.Group({user: req.session.user.id, group: input._id}); //create new  

   models.Groups.findOne({ _id: group._id }, 'private_type', function(err, group) {
    if (err){
      console.log(err);
      return;
    }
    if (!group.private_type){
      models.GroupMembers.findOneAndUpdate({user: req.session.user.id, group: input._id}, {user: req.session.user.id, group: input._id}, { upsert: true }, function(err, membership){
        console.log(membership);
      });
    } else {
      console.log('Unathorized to join private group');
    }
   });
};

//group creator add member
var addGroupMember = function (input){ //requireLogin
  models.Groups.findOne({ _id: input.group._id }, function(err, group) {
    if (group.private_type == true & group.group_creator == req.session.user.id){
      models.GroupMembers.findOneAndUpdate({user: req.session.user.id, group: input._id}, {user: req.session.user.id, group: input._id}, { upsert: true }, function(err, membership){
        console.log(membership);
      });
    } else {
      console.log('Unauthorized action: Add group member');
    }
  });
};






//create interest
var createInterest = function(interest){ //requireLogin
  if (!checkAdmin(req, res, 1) & !checkAdmin(req, res, 0)){ //check for admin rights
     console.log('Unauthorized account type');
     return;// res.status(403).send({error: 'Unauthorized account type'});
  }  
  var interest = new models.Interests(interest); //create new  
  models.Interests.findOne({name: interest.name}, function(err, found_interest) { //name should be unique
          if (!found_interest) { //THERE Couldn't be found a user with this group name
              interest.save(function(err) {
                  if (err) {
                      console.log(err);
                      return;// res.send(err); //ERROR
                  }
                  console.log(interest);

              });

              } else { 
              //THERE EXISTS A USER WITH THIS EMAIL
              //return res.status(401).send({error: "That email is already taken, please try another."});
                console.log('That interest already exists.');
              }   
      }); //FINDONE
};

//get all interests, 
var getAllInterests = function(){ //requireLogin
  //Retrieve entire interest list from DB
  models.Interests.find({}, function(err, interests) {
    if (err) {
      console.log(err);
      return;
      //return res.send(err);
    }
    // ONLY RETURN THE EMAIL AND DISPLAY NAME - empty or not!!!
    console.log(interests);
    //res.json(users);
    });
};

//create Post, update hashtags
var createPost = function(input){ //requireLogin
  /* 
  take care of username, userid
  hashtags - everytime the user an array of tags to choose from
  new hashtags????? TODO
  for each, create new entry
  */ 

//if member is a user of that group, or an admin, then they can create the post
      models.GroupMembers.findOne({user: req.session.user.id, group: input.post.group}, function(err, usergroup) {
        if (err) {
          //return res.send(err);
          console.log(err);
          return;
        }
        if (!usergroup){
          console.log('Group access for this user is unauthorized');
          return;
        } else {
          console.log(usergroup);
          var post = new models.Posts(input.post); //create new 
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
                      console.log(err);
                      return;// res.send(err); //ERROR
                  }
                  console.log(post);

         });

        }
      });    
};







//get post

/* via id, get the post. 
Load, populate the hashtags, 
rights: admin, public or by private member */
//Repeated code, imporve!
var getPostByID = function (post){
      models.Posts.findOne({ _id: post._id })
      .populate({
      path: 'post_type'
      //populate: { path: 'interests' }
      })
      .populate({
      path: 'group',
      select: 'name'
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
          console.log(err);
          return;
        } else if (!post){
          console.log('Could not find post.');
          return;
        }
        
        //Authorization check 
        if (!checkAdmin(req, res, 1) & !checkAdmin(req, res, 0)){
          models.Groups.findOne({group: post.group, user: req.session.user.id}, function(err, user){
            if (err | !user){
              console.log('Unable to authenticate. Post viewing action not allowed for this user.');
              return; //res  send
            }

            //when we get the post, also get the user's rating (if they did one)
            models.PostRatings.findOne({ userid: req.session.user.id, postid: post._id}, function(err, post_rating) {
              if (err){
                console.log(err);
                return;
              } else if (!post_rating){
                console.log(post)
                return;
              }
              var postObj = post.toObject();
              post.rating = post_rating.rating;
              console.log(postObj); //send as res
            });


          });

        } else {
            //when we get the post, also get the user's rating (if they did one)
          models.PostRatings.findOne({ userid: req.session.user.id, postid: post._id}, function(err, post_rating) {
            if (err){
              console.log(err);
              return;
            } else if (!post_rating){
              console.log(post)
              return;
            }
            var postObj = post.toObject();
            post.rating = post_rating.rating;
            console.log(postObj); //send as res
          });
        }

      });
};




var updatePost = function(input){
    //TODO: hashtags, for each create new in hashtag
   models.Post.findOne({ _id: req.body._id }, function(err, post) {
    if (err) {
      return res.send(err);
    } else if (!post){
      console.log('Post does not exist.');
      return;
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
        //res.json({ message: 'User profile updated!' });
        console.log(post);
      });
    } else {
      console.log('Unauthorized post update');
    }
  });
};


var getAllPostTypes = function(){ //require login
    models.PostTypes.find({}, function(err, types) {
    if (err) {
      console.log(err);
      return;
      //return res.send(err);
    }
    // ONLY RETURN THE EMAIL AND DISPLAY NAME - empty or not!!!
    console.log(types);
    //res.json(users);
    });

};

var postComment = function (comment){
  //to post a comment, user must be a member of the group
  models.GroupMembers.findOne({user: req.session.user.id, group: comment.group}, function(err, usergroup) {
        if (err) {
          //return res.send(err);
          console.log(err);
          return;
        }
        if (!usergroup){
          console.log('Commenting on this post is unauthorized for this user');
          return;
        } else {
          console.log(usergroup);
          
          var commentObj = {
            userid: req.session.user.id,
            username: req.session.user.username,
            text: comment.text
          };
          //update the post comment array
          models.posts.findByIdAndUpdate(
          comment.post._id, //111
          {$push: {comments: commentObj}},
          {safe: true, upsert: true},
          function(err, comment) {
            if (err){
              console.log(err);
              return;
            }
            console.log(comment);
          });
        }
    });    

};

var ratePost = function(rating){ //requireLogin
  //number from 1-5 check
  //check that a rating does not already exist this user and post id
  //if it does, just update the number
  //check that the user is a member of post's group first
  if (rating.stars < 1 | rating.stars > 5){
    console.log('Error: rating is out of bounds!');
    return;
  }
  //update the post five stars, four stars, etc
  models.Posts.findById(rating.post._id, function(err, post){
    if (err){
      console.log(err);
      return;
    } else if (!post){
      console.log('Cannot authorize action rating: Post ref does not exist');
      return;
    } else if (post.userid == req.session.user.id) {
      console.log('A user cannot rate their own post');
      return;
    }
    models.GroupMembers.findOne({user: req.session.user.id, group: rating.post.group}, function(err, usergroup) {
      if (err){
        console.log(err);
        return;
      } else if (!usergroup){
        console.log('Rating on this post is unauthorized for this user.');
        return;
      }
        //check that a rating does not already exist this user and post id
        models.PostRatings.findOne({postid: rating.post._id, userid: req.session.user._id}, function(err, post_rating) {
          if(err){
            console.log(err);
            return;
          } 

          else if (!post_rating){ //a rating by this user for this post does not exist yet
            //CREATE NEW
            var in_rating = new models.PostRatings({postid: post._id, 
                                                      userid: req.session.user.id, 
                                                      rating: rating.stars}); //create new  
            in_rating.save(function(err) { //SAVE NEW
              if (err) {
                return res.send(err);
              }
              //res.json({ message: 'User profile updated!' });
              console.log('New rating saved!');
            });
            
          } else {
            //UPDATE OLD RATING
             modifyPostRatingHelper(post, post_rating.rating, true);
             post_rating.rating = rating.stars; //new num stars
             post_rating.save(function(err) {
                if (err) {
                  console.log(err);
                  return;
                }
                console.log('User rating for this post updated!');
             });
          } 

          modifyPostRatingHelper(post, rating.stars, false);
          calculateAverageRating(post);
          post.save(function(err) {
            if (err) {
              console.log(err);
              return;
            }
            console.log('Post rating count updated!');
          });
        });

    });
  
});
};

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
}

 

var deleteUser = function(input){
  if (!checkAdmin(req, res, 1) & !checkAdmin(req, res, 0)){ //Action only allowed for Admins.
    return res.status(403).send({error: 'Unauthorized account type'});
  }
  models.Users.findById(input.user.id, function(err, user){
      user.remove(function(err, user) {
      if (err) {
        console.log(err);
      } else if (user && user.result.n > 0){
      console.log("User deleted!");
      /*models.Posts.find({}, function(err, posts) {
        console.log(posts);
        models.PostRatings.find({}, function(err, ratings) {
          //console.log(ratings);
        });

      });*/
    } else {
      console.log('Unable to delete this user');
    }
    
    });

  });

};

var deleteGroup = function(input){
  if (!checkAdmin(req, res, 1) & !checkAdmin(req, res, 0)){ //Action only allowed for Admins.
    return res.status(403).send({error: 'Unauthorized account type'});
  }
  models.Groups.findById(input.group.id, function(err, group){
      if (!checkAdmin(req, res, 1) & !checkAdmin(req, res, 0) & group.group_creator != req.session.user.id){ //Action only allowed for Admins.
        return res.status(403).send({error: 'Unauthorized account type'});
      }
      group.remove(function(err, group) {
      if (err) {
        console.log(err);
      } else if (group && group.result.n > 0){
      console.log("Group deleted!");
      /*models.Posts.find({}, function(err, posts) {
        console.log(posts);
        models.PostRatings.find({}, function(err, ratings) {
          //console.log(ratings);
        });

      });*/
      } else {
        console.log('Unable to delete this group');
      }
    
    });

  });

};

var deletePost = function(input){
  models.Posts.findById(input.post.id, function(err, post){
      if (!checkAdmin(req, res, 1) & !checkAdmin(req, res, 0) & post.userid != req.session.user.id){ //Action only allowed for Admins.
        return res.status(403).send({error: 'Unauthorized account type'});
      }
      post.remove(function(err, post) {
      if (err) {
        console.log(err);
      } else if (post && post.result.n > 0){
      console.log("Post deleted!");
      /*models.Posts.find({}, function(err, posts) {
        console.log(posts);
        models.PostRatings.find({}, function(err, ratings) {
          //console.log(ratings);
        });

      });*/
    } else {
      console.log('Unable to delete this post');
    }
    
    });

  });

};


var searchByGroup = function (group){
  //auth: only group where the user is signed in

 models.Group.findById(group._id, function(err, group){
    if (!checkAdmin(req, res, 1) & !checkAdmin(req, res, 0)){
      if (err){
        console.log(err);
        return;
      } else if (group.private_type){
        console.log('User is allowed to access this group.');
        return;
      }
    }
    models.Posts.
    find({group:  group._id}).
    limit(100).
    sort({ date_posted: -1 }).
    select('post_type group short_text username userid date_posted averagerating numberofratings').
    exec(function(err, posts){
      console.log(posts);
    });
  });

};




var searchByTagname = function (tagname){
  //auth: only posts that are public, or that user is signed in to
  models.Groups.find({private_type: false}, {_id: 1}, function(err, docs) {

      // Map the docs into an array of just the _ids
      var ids_public = docs.map(function(doc) { return doc._id; }); //all the public group ids
      models.GroupMembers.find({user: req.session.user.id, group: {$nin : ids_public}}, {_id: 1}, function(err, docs){
        var ids_private = docs.map(function(doc) { return doc.group; });
        var merged_group_ids = ids_public.concat(ids_private);
        models.Posts.
        find({hashtags: { "$in" : [tagname]} }, group: {"$in" : merged_group_ids}).
        limit(100).
        sort({ date_posted: -1 }).
        select('post_type group short_text username userid date_posted averagerating numberofratings').
        exec(function(err, posts){
          if (err){
            console.log(err);
            return;
          }
          console.log(posts);
        });
      });
    });
};



var getPostsByInterest = function(interest){ //requireLogin

  /*
  Posts whose group the user is signed in to, + public 
order by date, rating, 100 first 

1. Get all posts by that interest
2. where the post group is public, or the user is member of that group
public OR 
3. Date, rating, 100 first
  */

  models.Interests.findOne({_id: interest._id, name: interest.name}, function (err, found_interest){
    if (err){
      console.log(err);
      return;
    } else if(!found_interest){
      console.log('Interest ' + interest.name + ' does not exist.');
      return;
    }
    models.Groups.find({private_type: false}, {_id: 1}, function(err, docs) {

      // Map the docs into an array of just the _ids
      var ids_public = docs.map(function(doc) { return doc._id; }); //all the public group ids
      models.GroupMembers.find({user: req.session.user.id, group: {$nin : ids_public}}, {_id: 1}, function(err, docs){

        var ids_private = docs.map(function(doc) { return doc.group; });
        var merged_group_ids = ids_public.concat(ids_private);

        models.Posts.
        find({group: { "$in" : merged_group_ids} }, interest: found_interest._id).
        //where('name.last').equals('Ghost').
       // where('age').gt(17).lt(66).
        //where('likes').in(['vaporizing', 'talking']).
        sort({date_posted: -1}).
        limit(100).
        select('post_type group short_text username userid date_posted averagerating numberofratings').
        exec(function(err){
          if (err) {
            console.log(err);
            return;
          } 
          console.log('Searched for posts by interests!');
        });

    });

   });

  });
};




/* 

Regarding hashtags, so far I cannot figure out how to choose which hashtags to present. 
There are two parameters, use_count, and date_last_used. Which takes precedent? 
For now, I'll use date_last_used first, get tags used less than 100 days ago, order 
by use_count descending, and extract the top 100 of the list.
*/
var hashTagIndex = function(){ //require login

  var today = moment();
  var daysago = moment(today).subtract(100, 'days')

  models.HashTags.
  find({}).
  where('last_used').gt(daysago.toDate()).
  sort({ count: -1 }).
  limit(100).
  select('name').
  exec(function(err, tags){
    console.log(tags);
  });

};



/* 
0. get all interests (a, b, c) and groups (1, 2, 3) of this user
1. Find all users who have intersecting interests (a,b,c) AND are in intersecting groups (1,2,3).
2. Find posts rated by users in (1) as 4, 5, created less than a year ago, and NOT rated by THIS (self) user,
limit to top 100.
3. (select right feilds)!

*/
var mainFeed = function(){ //requirelogin

  console.log(user_ids[0]);
  models.Users.findOne({_id: user_ids[0]}).exec(function(err, docs){
        if (err){
          console.log(err);
          return;
        } else if (!docs){
          console.log('Something went wrong.');
          return;
        }
        console.log('found this user Adele: ' + docs);
         var interest_ids = docs.interests.map(function(id) { return id; }); //array of ids
         if (interest_ids.length == 0){
            console.log('No interests, nothing to show here!')
            return;
         }
         models.GroupMembers.find({user: user_ids[0]}, 'group').exec(function(err, docs){
            if (err){
              console.log(err);
              return;
            } else if (!docs){
              console.log('No groups, nothing to show here!')
              return;
            }
            var group_ids = docs.map(function(obj) { return obj.group; });
            //console.log(group_ids);
            //find all users with interests (a, b or c) AND in a group of (1, 2, or 3)
            console.log('Adeles interests are: ' + interest_ids[0] + ' ' + typeof(interest_ids[0]));
            models.Users.find({_id: {$ne: user_ids[0]}, interests: { "$in" : interest_ids} }, '_id').exec(function(err, docs){
              if (err){
                console.log(err);
                return;
              } else if (!docs){
                //no Users with mutual interests
                //GOTO: Group feed for this user!
                getGroupFeed();
              }
              var user_ids = docs.map(function(obj) { return obj._id; });
               models.GroupMembers.find({user: {$ne: user_ids[0]}, group: { "$in" : group_ids}, user: { "$in" : user_ids} }, '_id').exec(function(err, docs){
                if (err){
                  console.log(err);
                  return;
                } else if(!docs){
                  //no Users with mutual interests & mutual groups
                  //GOTO: Group feed for this user!
                  getGroupFeed();
                }
                var intersect_users = docs.map(function(obj) { return obj.user; });
                models.PostRatings.
                find({userid: { "$in" : intersect_users}}).
                where('rating').gt(3).lt(6). //rated as 4 or 5
                select('postid').
                exec(function(err, docs){ //anything they rated as 4 or 5
                  if (err) { console.log(err); return;}
                  else if (!docs) {
                    //no Users with mutual interests & mutual groups & special posts
                    //GOTO: Group feed for this user!
                    getGroupFeed();
                  } 
                  var temppostids = docs.map(function(obj) { return obj.postid; });

                  //Get all posts that 'this' user has not seen before (via rating).
                  models.PostRatings.find({postid: { "$in" : temppostids}, user : user_ids[0]}, 'postid').exec(function(err, docs){
                    if (err) { console.log(err); return;}
                    var finalpostids = [];
                    if(!docs) { //this user has not rated anything, safe to skip additional "already seen" check
                      finalpostids = temppostids;
                    } else {
                      var seenpostids = docs.map(function(obj) { return obj.postid; });
                      for (var i = 0; i < temppostids.length; i++){
                          boolean bad = false;
                          for (var j = 0; j < seenpostids; j++){
                            if (temppostids[i] == seenpostids[j]){
                              bad = true;
                              break;
                            }
                          } //END INNER FOR seenpostids
                          if (!bad){
                            finalpostids.push(temppostids[i]);
                          }
                      } //END OUT FOR temppostids
                    }

                    if (finalpostids.length == 0){
                      //no special posts, give up
                      //GOTO: Group feed for this user!
                      getGroupFeed();
                      return;
                    }
                   
                    var today = moment();
                    var daysago = moment(today).subtract(100, 'days')

                    models.Posts
                    .find({_id : {"$in" : finalpostids}})
                    .where('date_posted').gt(daysago.toDate()).
                    .limit(100).
                    select('post_type group short_text username userid date_posted averagerating numberofratings').
                    exec(function(err, posts){
                      if (err) {console.log(err); return;}
                      if (!posts){
                        //no special posts, give up
                        //GOTO: Group feed for this user!
                        getGroupFeed();
                        return;
                      }
                      console.log(posts);
                    });


                  }); //END NOT rated by THIS (self) user,

                  
                  


                }); //ENd Find posts rated by users in (1) as 4, 5

               }); //END intersecting users.


            });

            /* 
`            all user who have interescting interests 

              
              all users who are in this group 

            */

         });


      });

};


var getGroupFeed = function () {
  /* 
  Get most recent feed from all user's groups
  */
  models.GroupMembers.find({user: user_ids[0]}, 'group').exec(function(err, docs){
      if (err){
        console.log(err);
        return;
      } else if (!docs){
        console.log('No groups, nothing to show here!')
        return;
      }
      var group_ids = docs.map(function(obj) { return obj.group; });
      models.Posts.find({group: { "$in" : group_ids}})
      .sort({ date_posted: -1 })
      .limit(100)
      .select('post_type group short_text username userid date_posted averagerating numberofratings').
      exec(function(err, posts){
        if (err){
          console.log(err);
          return;
        } 
        console.log(posts);
      });
  });

};



  // Get the _ids of people with the last name of Robertson.

/* Posts whose group the user is signed in to, + public 
order by date, rating, 100 first
*/

//get interests user does not have?
//we will get all and a function that sorts the rabble from the gold

//interests GET posts by interest, delete interests, 
/*
Posts whose group the user is signed in to, + public 
order by date, rating, 100 first
*/

//ALL THE DELETES:
//user, DONE
//interest NOT REQUIRED
//group, DONE 
//post (pre done) DONE

//user - PostRatings, PostSchema, Usergroups, user 

//Authentication of Deletes, and recentmost creap
//Rest api methods
//Clean up 
//Commit
//Join with login page!



/* 
var getUserProfile = function (username){
- GET /users/profile
var createUser = function (user){
- POST /register
var loginUser = function (user){
- POST /login


var updateUser = function (user){
- POST /users/profile


var changePassword = function (user){
PUT /users/profile/passwordchange


var changePasswordRegular = function (user)
var changePasswordAdmin = function (user)


var getUsers = function(){
GET /users/

var getGroupByID = function(group){
GET /groups/group

var getAllGroups = function(){
GET /groups/

var getUserGroups = function(){
GET /users/user/groups

var createGroup = function(group){
POST /groups/addnew

var updateGroup = function (group){ 
PUT /groups/group

{{{{{{{{{{{{{{{
var joinGroup = function (group){
PUT /groups/group/joingroup

var addGroupMember = function (input){
POST /groups/group/adduser
}}}}}}}}}}}}}}}}}}}}}


var createInterest = function(interest){
POST /interests/addnew

var getAllInterests = function(){ 
GET /interests/

var createPost = function(input){
POST /posts/addnew

ar getPostByID = function (post)
GET /posts/post

var updatePost = function(input)
PUT /posts/post

var getAllPostTypes = function(){
GET /posttypes


var postComment = function (comment){
POST /posts/post/addcomment

var ratePost = function(rating){ 
POST /posts/post/rate

var deleteUser = function(input)
DELETE /users/profile/:id

var deleteGroup = function(input)
DELETE /groups/group/:id

var deletePost = function(input){
DELETE /posts/post/:id

var searchByGroup = function (group)
GET /groups/group/posts

var searchByTagname = function (tagname)
GET /tags/tag/posts


var getPostsByInterest = function(interest){
GET /interests/interest/posts

var hashTagIndex = function(){
GET /tags/

var mainFeed = function(){
GET /dashboard/
*/





/*
//PROFILE TODO: send to RESPONSE //RequireLogin

*/






function test () {
  console.log('Hello we are sitting with me!');
  var post = {
    _id: postids[0]
  };
  //mainFeed();
  //getUser('Adele');
  //searchByGroup();

}






