var passport = require('passport'),
	User = require('mongoose').model('Users'),
	LocalStrategy = require('passport-local').Strategy,
	generateHash = require('./bcrypt').generateHash,
	validPassword = require('./bcrypt').validPassword;

module.exports = function () {
	passport.use('local-signup', new LocalStrategy({
		usernameField: 'email',
		passwordField: 'password',
		passReqToCallback: true
	},
	function(req, email, password, done){
		if(!req.body || !req.body.username){
			return done(null, false, {message: "Username missing!"})
		}
		User.findOne({email: email}, function(err, existingUser){
			if(err){
				return done(err)
			}

			if(existingUser){
				// User with this email already exists
				// 			err   user     info
				return done(null, false, {message: "Email already in use!"})
			}else{
				// New email
				User.findOne({username: req.body.username}, function(err, userWithUsername){
					if(err){
						return done(err)
					}

					if(userWithUsername){
						// There already exists a user with this username
						return done(null, false, {message: "Username already in use!"})
					}else{
						var user = new User()

						user.email = email
						user.password = generateHash(password)
						user.username = req.body.username

						user.save(function(err, newUser){
							console.log("Saving")
							done(err, newUser)
						})
					}
				})
			}
		})
	}))

	passport.use('local-login', new LocalStrategy({
		usernameField: 'email',
		passwordField: 'password',
		passReqToCallback: true
	},
	function(req, email, password, done){
		// Someone's logging in, lets check if the email is in the db
		User.findOne({email: email}, function(err, existingUser){
			if(err){
				return done(err)
			}
			// No user found
			if(!existingUser){
				return done(null, false, {message: "No user found with those credentials!"})
			}

			//Invalid password UNCOMMENT LATER
			if(!validPassword(password, existingUser)){
				return done(null, false, {message: 'Invalid password! Try again!'})
			}

			return done(null, existingUser)
		})
	}))
}
