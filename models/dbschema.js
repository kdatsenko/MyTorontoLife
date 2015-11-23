var Schema       = mongoose.Schema;

var interestSchema = new Schema({
	name: {type: String, unique: true, required: '{PATH} is required.'}
});	

module.exports = mongoose.model('Interests', interestSchema);

var userSchema   = new Schema({
  email: {type: String, unique: true}, //unique 
  password: String,
  accounttype: Number, //0 for Super Admin, 1 for Admin, 2 for user
  loggedin: Boolean,
  last_seen: Date,
  username: {type: String, required: '{PATH} is required.', unique: true}  
  description: {type : String, default : ''},
  imageurl: {type : String, default : '../images/cool_cat.png'},
  //validation between 10 and 200 (vampires!)
  age: { type: Number, min: 10, max: 200}
  gender: {type: String, enum: ['male', 'female', 'unknown'] } //for aliens!
  homeaddress: String,
  workplace: String,
  position: String,
  contactinfo: String,
  interests: [
      {type: ObjectId, ref: 'Interests'}
   ],
   //user reputation parameters
   numberofposts: Number,
   fivestarposts: Number,
   fourstarposts: Number,
   threestarposts: Number,
   twostarposts: Number,
   onestarposts: Number
});

module.exports = mongoose.model('Users', userSchema);

var postTypesSchema = new Schema({
	name: {type: String, unique: true, required: '{PATH} is required.'}
});	

module.exports = mongoose.model('Types', postTypesSchema);

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

module.exports = mongoose.model('Groups', groupsSchema);

var userGroups = = new Schema({
  user: {type: ObjectId, required: true, ref: 'Users'},
  group: {type: ObjectId, required: true, ref: 'Groups'}
});

module.exports = mongoose.model('GroupMembers', userGroups);

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
	name: {type: String, index: {unique: true}, lowercase: true, validate: tagValidator}
	last_used: Date,
	count: Number
});	

module.exports = mongoose.model('Hashtags', hashTags);

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
	]
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

module.exports = mongoose.model('Posts', postsSchema);

var postsRatings = new Schema({
	postid: {type: ObjectId, required: true, ref: 'Posts'},
	userid: {type: ObjectId, required: true, ref: 'Users'},
	rating: {type: Number, min: 1, max: 5}
});	


