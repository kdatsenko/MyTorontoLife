var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var session = require('express-session');
var passport = require('passport');
var models = require('./models/dbschema');
var ObjectId = mongoose.Types.ObjectId;
var app = express();

//mongoose.connect('mongodb://localhost/csc309a5'); // connect to our database

var dbName = 'A5DB';
var connectionString = 'mongodb://localhost:27017/' + dbName;


var types = [new ObjectId, new ObjectId, new ObjectId, new ObjectId, new ObjectId, new ObjectId];
var interest_ids = [new ObjectId, new ObjectId, new ObjectId, new ObjectId, new ObjectId, new ObjectId];
var group_ids = [new ObjectId,
new ObjectId,
new ObjectId,
new ObjectId,
new ObjectId,
new ObjectId,
new ObjectId,
new ObjectId,
new ObjectId,
new ObjectId,
new ObjectId,
new ObjectId];
var user_ids = [new ObjectId, new ObjectId, new ObjectId];

var hashtag_ids = [new ObjectId, new ObjectId, new ObjectId, new ObjectId, new ObjectId, new ObjectId];

var post_ids = [new ObjectId, new ObjectId, new ObjectId, new ObjectId, new ObjectId, new ObjectId];

var rating_ids = [new ObjectId, new ObjectId, new ObjectId,
new ObjectId, new ObjectId, new ObjectId];


mongoose.connect(connectionString, function(err) {
  if(err) {
    console.log('connection error', err);
  } else {
    console.log('connection successful');

    mongoose.connection.db.dropDatabase();


  var postTypes = [{_id: types[0], name: 'Announcement'},
                  {_id: types[1], name: 'Question'},
                  {_id: types[2], name: 'Business Ad'},
                  {_id: types[3], name: 'Event'},
                  {_id: types[4], name: 'Sale Listing'},
                  {_id: types[5], name: 'Poll'}];


var interests = [{_id: interest_ids[0], name: 'Food'},
                  {_id: interest_ids[1], name: 'Bars'},
                  {_id: interest_ids[2], name: 'Condo'},
                  {_id: interest_ids[3], name: 'Parks and Recreation'},
                  {_id: interest_ids[4], name: 'Hockey'},
                  {_id: interest_ids[5], name: 'Cat Cafe'}];




 var desc1 = "Groups - I assume we will preload some groups. " +
  "How does the user belong to a group? Can they choose any " +
  "group to join? Are there public and private groups? " +
  "Will the user only see posts for the groups that they " +
  "are registered with? Right now, I have set it so that " +
  "all groups are by default public, and I was thinking " +
  "that if a group is private then users already in the " +
  "group have the privilege to add others. search and " +
  "rate things in neighbourhood Toronto overall. Does " +
  "this mean search and rate posts in the group the " +
  "user belongs to? Site events? Page views I understand, " +
  "but what else goes into this? Post expiry date - " +
  "why do we need it? What happens to the post after expiry? " +
  "I am concerned because there are tuples in other tables " +
  "that depend on the post, and reputation of the user is " +
  "aggregated based on ratings on their posts, so we shouldn’t " +
  "remove the posts. How to calculate the user’s reputation? " +
  "Example: there could be 1 post with a five star rating made by one user. " +
  "On the other hand, there could be a post where 100 users voted. Also, " +
  "some users have only a few posts, while others have multiple. So I was " +
  "thinking what if we will create some formula based on numbers " +
  "of posts and 5, 4, … 1 rating counts, number of votes.";

  var desc2 = "A politically adept and popular leader of the Roman Republic, " +
  "Julius Caesar significantly transformed what became known as the Roman Empire, " +
  "by greatly expanding its geographic reach and establishing its imperial system. " +
  "While it has long been disputed, it's estimated that Julius Caesar was born in " +
  "Rome on July 12 or 13, 100 BC. While he hailed from Roman aristocrats, " +
  "his family was far from rich. When Caesar was 16 his father, " +
  "Gaius Caesar, died. He remained close to his mother, Aurelia. " +
  "The Rome of Caesar's youth was unstable. An element of disorder ruled the " +
  "Republic, which had discredited its nobility and seemed unable to " +
  "handle its considerable size and influence";

  var desc3 = "In choosing a cat, you must first decide whether you want " +
   "to bring home a kitten, a juvenile, or an adult. Generally, kittens are " +
   "curious, playful, and energetic. You get to watch them grow and mature, " +
   "and can influence the development of their personality. A kitten may " +
   "also be more readily accepted by pets that you already have. An adult " +
   "cat's personality is already established, so you'll have a better idea " +
   "of what kind of pet it will be in your home situation. Adult cats also " +
   "usually require less intensive care and supervision than kittens or  " +
   "juveniles do. A second thing to consider in choosing a cat is whether " +
   "you want a pedigreed or a mixed-breed animal. Mixed-breed cats are " +
   "generally categorized as either domestic shorthairs or domestic longhairs. " +
   "Mixed-breed and pedigreed cats both can be excellent companions. The greatest " +
   "advantage of getting a pedigreed kitten or adult is that its size, appearance, " +
   "and to some extent, personality, are likely to fit the profile of its particular " +
   "breed. With a mixed-breed kitten, you will be unable to predict its adult size " +
   "and appearance as accurately.";




  var groups = [{_id: group_ids[0], name: 'Toronto', private_type: false, group_creator: user_ids[0], description: desc1},
                  {_id: group_ids[1], name: 'Etobicoke', private_type: false, group_creator: user_ids[0], description: desc2},
                  {_id: group_ids[2], name: 'Little Italy', private_type: false, group_creator: user_ids[0], description: desc3},
                  {_id: group_ids[3], name: 'Kensington', private_type: false, group_creator: user_ids[0], description: 'Kensington yay'},
                  {_id: group_ids[4], name: 'Guelph', private_type: false, group_creator: user_ids[0], description: 'Guelph yay'},
                  {_id: group_ids[5], name: 'Old Mill', private_type: false, group_creator: user_ids[0], description: 'Old Mill yay'},
                  {_id: group_ids[6], name: 'Marys Housemates', private_type: false, group_creator: user_ids[1], description: 'Marys Housemates yay'},
                  {_id: group_ids[7], name: 'Ontario', private_type: false, group_creator: user_ids[1], description: 'Ontario yay'},
                  {_id: group_ids[8], name: 'Waterloo', private_type: false, group_creator: user_ids[1], description: 'Waterloo yay'},
                  {_id: group_ids[9], name: 'London', private_type: false, group_creator: user_ids[2], description: 'London yay'},
                  {_id: group_ids[10], name: 'Bloor', private_type: false, group_creator: user_ids[2], description: 'Bloor yay'},
                  {_id: group_ids[11], name: 'UofT', private_type: false, group_creator: user_ids[2], description: 'UofTn yay'}];


  var usergroups = [{user: user_ids[0], group: group_ids[0]},
    {user: user_ids[2], group: group_ids[0]},
  {user: user_ids[1], group: group_ids[0]},
  {user: user_ids[0], group: group_ids[1]},
  {user: user_ids[0], group: group_ids[2]},
  {user: user_ids[0], group: group_ids[3]},
  {user: user_ids[2], group: group_ids[3]},
  {user: user_ids[0], group: group_ids[4]},
  {user: user_ids[0], group: group_ids[5]},
  {user: user_ids[2], group: group_ids[5]},
  {user: user_ids[1], group: group_ids[5]},

  {user: user_ids[1], group: group_ids[6]},
  {user: user_ids[1], group: group_ids[7]},
  {user: user_ids[1], group: group_ids[8]},
  {user: user_ids[2], group: group_ids[8]},
  {user: user_ids[0], group: group_ids[8]},

  {user: user_ids[2], group: group_ids[9]},
  {user: user_ids[2], group: group_ids[10]},
  {user: user_ids[1], group: group_ids[10]},
  {user: user_ids[2], group: group_ids[11]},
  {user: user_ids[0], group: group_ids[11]}];








 var users = [
 { _id: user_ids[0],
  email: 'adele@gmail.com',
  password: bcrypt.hashSync('dddd', bcrypt.genSaltSync(8), null),
  accounttype: 0, //0 for Super Admin, 1 for Admin, 2 for user
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
  interests: [interest_ids[0], interest_ids[1], interest_ids[2], interest_ids[4]]},
 { _id: user_ids[1],
  email: 'mchammer@gmail.com',
  password: bcrypt.hashSync('dddd', bcrypt.genSaltSync(8), null),
  accounttype: 2, //0 for Super Admin, 1 for Admin, 2 for user
  loggedin: 0,
  username: 'MCHammer',
  description: 'Cant touch this',
  //validation between 10 and 200 (vampires!)
  age: 25,
  gender: 'male', //for aliens!
  homeaddress: 'USA',
  workplace: 'Some label',
  position: 'Songster',
  contactinfo: 'Forget it',
  interests: [interest_ids[0], interest_ids[2], interest_ids[4], interest_ids[5]]},
  { _id: user_ids[2],
    email: 'lanadelrey@gmail.com',
  password: bcrypt.hashSync('dddd', bcrypt.genSaltSync(8), null),
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
  interests: [interest_ids[0], interest_ids[1], interest_ids[3], interest_ids[4]]
}];

console.log((new Date) + ' ' + Date.now())

 var hashtags = [{_id: hashtag_ids[0], name: 'Cool', last_used: new Date, count: 2},
                  {_id: hashtag_ids[1], name: 'Interesting', last_used: new Date, count: 1},
                  {_id: hashtag_ids[2], name: 'Coolerthanyourcity', last_used: new Date, count: 1},
                  {_id: hashtag_ids[3], name: 'greatlandscapes', last_used: new Date, count: 1},
                  {_id: hashtag_ids[4], name: 'someonecalltheplumber', last_used: new Date, count: 1},
                  {_id: hashtag_ids[5], name: 'lostatsomewhere', last_used: new Date, count: 1}];





var posts = [
{ _id: post_ids[0],
  post_type: types[0],
  group: group_ids[0],
  date_posted: new Date,
  text: desc3,
  short_text: desc3.substring(0, 200),
  username: 'Adele',
  userid: user_ids[0],
  hashtags: [
    {tag_id: hashtag_ids[0],
      name: 'Cool'},
      {tag_id: hashtag_ids[2],
      name: 'Coolerthanyourcity'}],
  interest: interest_ids[0],
   comments: [
    {userid: user_ids[1],
     username: 'MCHammer',
   text: 'Yo, this is cool'}],
   fivestarcount: 2,
   fourstarcount: 0,
   threestarcount: 0,
   twostarcount: 0,
   onestarcount: 0,
   numberofratings: 0,
   averagerating: 5
 },

{_id: post_ids[1],
  post_type: types[1],
  group: group_ids[0],
  date_posted: new Date,
  text: desc2,
  short_text: desc2.substring(0, 200),
  username: 'LanaDelRey',
  userid: user_ids[2],
  hashtags: [
    {tag_id: hashtag_ids[0],
      name: 'Cool'},
      {tag_id: hashtag_ids[5],
      name: 'lostatsomewhere'}],
  interest: interest_ids[3],
   comments: [
    {userid: user_ids[1],
     username: 'MCHammer',
   text: 'Yo, this is quite cool, good post'},
   {userid: user_ids[0],
     username: 'Adele',
   text: 'So knowledgeable, Lana'}],
   fivestarcount: 1,
   fourstarcount: 0,
   threestarcount: 1,
   twostarcount: 0,
   onestarcount: 0,
   numberofratings: 0,
   averagerating: 4
 },

{ _id: post_ids[2],
  post_type: types[0],
  group: group_ids[0],
  date_posted: new Date,
  text: desc2,
  short_text: desc2.substring(0, 200),
  username: 'MCHammer',
  userid: user_ids[1],
  hashtags: [
    {tag_id: hashtag_ids[3],
      name: 'greatlandscapes'},
      {tag_id: hashtag_ids[4],
      name: 'someonecalltheplumber'},
      {tag_id: hashtag_ids[1],
      name: 'Interesting'}],
  interest: interest_ids[0],
   twostarcount: 1,
   onestarcount: 1,
   comments: [
    {userid: user_ids[1],
     username: 'MCHammer',
   text: 'Yo, check out my post'},
   {userid: user_ids[0],
     username: 'Adele',
   text: 'Ummm...'},
   {userid: user_ids[2],
     username: 'LanaDelRey',
   text: 'I agree with Adele'},
   {userid: user_ids[1],
     username: 'MCHammer',
   text: 'Why?'}],
   fivestarcount: 0,
   fourstarcount: 0,
   threestarcount: 0,
   twostarcount: 1,
   onestarcount: 1,
   numberofratings: 0,
   averagerating: 1.5

 }];




var postsRatings = [
  {_id: rating_ids[0], postid: post_ids[0],
  userid: user_ids[1],
  rating: 3},
  {_id: rating_ids[1], postid: post_ids[0],
  userid: user_ids[2],
  rating: 3},

  {_id: rating_ids[2], postid: post_ids[1],
  userid: user_ids[1],
  rating: 3},
  {_id: rating_ids[3], postid: post_ids[1],
  userid: user_ids[0],
  rating: 5},

  {_id: rating_ids[4], postid: post_ids[2],
  userid: user_ids[0],
  rating: 2},
  {_id: rating_ids[5], postid: post_ids[2],
  userid: user_ids[2],
  rating: 1}
  ];

models.Interests.collection.insert(interests, onInsert);
models.PostTypes.collection.insert(postTypes, onInsert);
 models.Groups.collection.insert(groups, onInsert);
 models.GroupMembers.collection.insert(usergroups, onInsert);
 models.Hashtags.collection.insert(hashtags, onInsert);
 models.Users.collection.insert(users, onInsert)
 models.Posts.collection.insert(posts, onInsert);
  models.PostRatings.collection.insert(postsRatings, onInsert);



 test();

  }

});

  function onInsert(err, docs) {
    if (err) {
        console.log(err);
    } else {
     //console.log(docs);
        console.log(docs.insertedCount + ' entries were successfully stored.');
    }
  }



var routes = require('./routes/index');

app.use(logger('dev'));

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

app.use(session({resave: true, saveUninitialized: true, secret: '25jh345hj34b7h8f', cookie: { maxAge: null}}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/', routes);

function test () {
  console.log('Hello we are sitting on test function in app.js!');
  //mainFeed();
  //getUser('Adele');
  //searchByGroup();

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

module.exports = app;
