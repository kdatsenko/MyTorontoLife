
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
  interests: [{type: Schema.ObjectId, ref: 'Interests'}],
   //user reputation parameters
   numberofposts: {type: Number, default: 0},
   fivestarposts: {type: Number, default: 0},
   fourstarposts: {type: Number, default: 0},
   threestarposts: {type: Number, default: 0},
   twostarposts: {type: Number, default: 0},
   onestarposts: {type: Number, default: 0}
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
	private_type: {type: Boolean, default: false},//True = private, False public
	description: String
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
	last_used: Date,
	count: Number
});	

var postsSchema = new Schema({
	post_type: {type: ObjectId, required: true, ref: 'Types'},
	group: {type: ObjectId, required: true, ref: 'Groups'},
	text: {type: String, required: '{PATH} is required.'},
	username: {type: String, required: true},
	userid: {type: ObjectId, required: true, ref: 'Users'},
	location: String,
	date_posted: {type: Date, default: Date.now},
	hashtags: [
		{tag_id: {type: ObjectId, ref: 'Hashtags'},
			name: String}
	],
	external_urls: [
		{type: String}
	],
   fivestarposts: Number,
   fourstarposts: Number,
   threestarposts: Number,
   twostarposts: Number,
   onestarposts: Number,
   imageurl: {type : String},
   commercial: {type: Boolean, default: false},
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

var Interests = mongoose.model('Interests', interestSchema);
var Users = mongoose.model('Users', userSchema);
var Types = mongoose.model('Types', postTypesSchema);
var Groups = mongoose.model('Groups', groupsSchema);
var GroupMembers = mongoose.model('GroupMembers', userGroups);
var Hashtags = mongoose.model('Hashtags', hashTags);
var Posts = mongoose.model('Posts', postsSchema);

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
    Types: Types,
    Groups: Groups,
    GroupMembers: GroupMembers,
    Hashtags: Hashtags,
    Posts: Posts
};

