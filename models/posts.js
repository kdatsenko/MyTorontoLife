var Schema       = mongoose.Schema;

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
