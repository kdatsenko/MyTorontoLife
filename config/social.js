var passport = require('passport'),
	GithubStrategy = require('passport-github2').Strategy

module.exports = function () {
	passport.use(new GithubStrategy({
		clientID: "d5953bfed87434d96c7c",
		clientSecret: "3872f06a99cf3ee667b0375ad610df2c4f8da583",
		callbackURL: "/auth/github/callback",
		passReqToCallback: true
	},
	function(req, accessToken, refreshToken, profile, done){
		req.session.profile = profile;
		return done(null, profile);
	}))
}