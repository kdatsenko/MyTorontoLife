
var mongoose=require('mongoose');
var validate=require('mongoose-validator');
var Schema       = mongoose.Schema;
var ObjectId = Schema.ObjectId;


var interestSchema = new Schema({
	name: {type: String, unique: true, required: '{PATH} is required.'}
});



var userSchema   = new Schema({
  email: {type: String, unique: true}, //unique
  password: String,
  accounttype: Number, //0 for Super Admin, 1 for Admin, 2 for user
  loggedin: Boolean,
  last_seen: {type: Date, default: Date.now},
  username: {type: String, required: '{PATH} is required.', unique: true},
  description: {type : String, default : ''},
  imageurl: {type : String, default : '../images/cool_cat.png'},
  //validation between 10 and 200 (vampires!)
  age: { type: Number, min: 10, max: 200},
  gender: {type: String, enum: ['male', 'female', 'unknown'] }, //for aliens!
  homeaddress: String,
  workplace: String,
  position: String,
  contactinfo: String,

  interests: [{type: ObjectId, ref: 'Interests'}],
   //user reputation parameters
   /*numberofposts: {type: Number, default: 0},
   fivestarposts: {type: Number, default: 0},
   fourstarposts: {type: Number, default: 0},
   threestarposts: {type: Number, default: 0},
   twostarposts: {type: Number, default: 0},
	onestarposts: {type: Number, default: 0}*/
});

var postTypesSchema = new Schema({
	name: {type: String, unique: true, required: '{PATH} is required.'}
});

var nameValidator = [
  validate({
    validator: 'isLength',
    arguments: [3, 100],
    message: 'Group name should be between {ARGS[0]} and {ARGS[1]} characters'
  })
];

var groupsSchema = new Schema({
	name: {type: String, unique: true, required: '{PATH} is required.', validate: nameValidator},
	private_type: {type: Boolean, default: true},//True = private, False public
  group_creator: {type: ObjectId, required: true, ref: 'Users'},
	description: {type: String, default: ''}
});

var userGroups = new Schema({
  user: {type: ObjectId, required: true, ref: 'Users'},
  group: {type: ObjectId, required: true, ref: 'Groups'}
});

var tagValidator = [
  validate({
    validator: 'isLength',
    arguments: [5, 50],
    message: 'Tag text should be between {ARGS[0]} and {ARGS[1]} characters'
  }),
   validate({
    validator: 'isAlphanumeric',
    passIfEmpty: true,
    message: 'Name should contain alpha-numeric characters only'
  })
];

var hashTags = new Schema({
	name: {type: String, index: {unique: true}, lowercase: true, validate: tagValidator},
	last_used: {type: Date, default: Date.now},
	count: Number
});

var postsSchema = new Schema({
  post_type: {type: ObjectId, required: true, ref: 'Types'},
	group: {type: ObjectId, required: true, ref: 'Groups'},
	text: {type: String, required: '{PATH} is required.'},
  short_text: {type: String, required: '{PATH} is required.'},
	username: {type: String, required: true},
	userid: {type: ObjectId, required: true, ref: 'Users'},
	date_posted: {type: Date, default: Date.now},
	hashtags: [
		{tag_id: {type: ObjectId, ref: 'Hashtags'},
			name: String}
	],
	external_urls: [
		{type: String}
	],

  interest: {type: Schema.ObjectId, ref: 'Interests'},
   fivestarcount: {type: Number, default: 0},
   fourstarcount: {type: Number, default: 0},
   threestarcount: {type: Number, default: 0},
   twostarcount: {type: Number, default: 0},
   onestarcount: {type: Number, default: 0},
   numberofratings: {type: Number, default: 0},
   averagerating: {type: Number, default: 0},

   imageurl: {type : String},
   comments: [
   	{userid: {type: ObjectId, required: true, ref: 'Users'},
     username: {type: String, required: true},
 	 text: {type: String, required: true}}
   ]
});

var postsRatings = new Schema({
	postid: {type: ObjectId, required: true, ref: 'Posts'},
	userid: {type: ObjectId, required: true, ref: 'Users'},
	rating: {type: Number, min: 1, max: 5}
});

postsRatings.index({ postid: 1, userid: 1 }, { unique: true }); // schema level

postsSchema.pre('remove', function(next) {
    // 'this' is the client being removed. Provide callbacks here if you want
    // to be notified of the calls' result.
    PostRatings.remove({postid: this._id}).exec();
    next();
});


userSchema.pre('remove', function(next) {
    // 'this' is the client being removed. Provide callbacks here if you want
    // to be notified of the calls' result.
    PostRatings.remove({userid: this._id}).exec();
    Posts.find({userid: this._id}, function(err, posts) {
      for (var i = 0; i < posts.length; i++){
        posts[i].remove();
      }
    });

    Groups.find({group_creator: this._id}, function(err, groups) {
      for (var i = 0; i < groups.length; i++){
        groups[i].remove();
      }
    });

    next();
});

groupsSchema.pre('remove', function(next) {
  GroupMembers.remove({group: this._id}).exec();
  //Posts to remove
  Posts.find({group: this._id}, function(err, posts) {
      for (var i = 0; i < posts.length; i++){
        posts[i].remove();
      }
  });
});

/*postsSchema.pre('remove', function(next) {
  PostRatings.remove({postid: this._id}).exec();
});*/

postsSchema.pre('save', function (next) {
  this.short_text = this.text.substring(0, 200);
  console.log('this.short_text: '  + this.short_text);
  next();
});

groupsSchema.post('save', function(next) {
  var group_membership = new models.GroupMembers({user: this.group_creator, group: this._id});
  group_membership.save(function(err, eh) {
    if (err) {
      console.log(err);
    }
    console.log('eh: ' + eh);
    next();
  });
});                  


var Interests = mongoose.model('Interests', interestSchema);
var Users = mongoose.model('Users', userSchema);
var PostTypes = mongoose.model('PostTypes', postTypesSchema);
var Groups = mongoose.model('Groups', groupsSchema);
var GroupMembers = mongoose.model('GroupMembers', userGroups);
var Hashtags = mongoose.model('Hashtags', hashTags);
var Posts = mongoose.model('Posts', postsSchema);

var PostRatings = mongoose.model('PostRatings', postsRatings);

  /*var interests = [{name: 'Food'},
                  {name: 'Bars'},
                  {name: 'Condo'},
                  {name: 'Parks and Recreation'},
                  {name: 'Hockey'},
                  {name: 'Cat Cafe'}];

  var postTypes = [{name: 'Announcement'},
                  {name: 'Question'},
                  {name: 'Business Ad'},
                  {name: 'Event'},
                  {name: 'Sale Listing'},
                  {name: 'Poll'}];

  var groups = [{name: 'Toronto'},
                  {name: 'Etobicoke'},
                  {name: 'Little Italy'},
                  {name: 'Kensington'},
                  {name: 'Guelph'},
                  {name: 'Old Mill'},
                  {name: 'Marys Housemates'},
                  {name: 'Distillery District'}];*/







module.exports = {
    Interests: Interests,
    Users: Users,
    PostTypes: PostTypes,
    Groups: Groups,
    GroupMembers: GroupMembers,
    Hashtags: Hashtags,
    Posts: Posts,
    PostRatings: PostRatings
};
