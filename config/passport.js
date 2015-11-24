var passport = require('passport')

module.exports = function() {
	// handle user serialization here...
	passport.serializeUser(function(user, done) {
	  done(null, user);
	});

	passport.deserializeUser(function(obj, done) {
	  done(null, obj);
	});
	require('./social.js')()
}