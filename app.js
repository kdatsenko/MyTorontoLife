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
