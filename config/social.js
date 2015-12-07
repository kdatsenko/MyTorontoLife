var passport = require('passport'),
	GithubStrategy = require('passport-github2').Strategy,
	User = require('mongoose').model('Users')

module.exports = function () {
	passport.use(new GithubStrategy({
		clientID: "d5953bfed87434d96c7c",
		clientSecret: "3872f06a99cf3ee667b0375ad610df2c4f8da583",
		callbackURL: "https://polar-reef-5864.herokuapp.com/auth/github/callback",
		passReqToCallback: true
	},
	function(req, accessToken, refreshToken, profile, done){
		User.findOne({email : profile.emails[0].value}, function(err, existingUser){
			if(existingUser){
				// This user email already exists in the database, so lets
				// return that user
				done(null, existingUser);
			}else{
				console.log("Github: User not found, creating new")
				// User email not in the database
				// Let's create a new user

				// This is just placeholder, as we may not want
				// Users to be added to the database automatically
				// When they sign in with social media

				var user = new User()
				user.email = profile.emails[0].value
				user.username = profile._json.login
				// Username may not be unique
				user.username += Math.round(Math.random()*10000).toString()
				// Set password to placeholder 8 Character random alphanumeric string
				user.password = Math.random().toString(36).slice(2, 10)
				// Set image to github image
				user.imageurl = profile._json.avatar_url

				user.save(function(err, resultingUser){
					console.log("Github: Saving new user")
					done(err, resultingUser)
				})
			}
		})
		req.session.profile = profile;
		// return done(null, profile);
	}))
}
