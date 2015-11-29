var Schema       = mongoose.Schema;

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
