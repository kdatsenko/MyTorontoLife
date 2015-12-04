var express = require('express');
var router = express.Router();
var passport = require('passport')

/* /auth */
router.get('/github', passport.authenticate('github', { scope: [ 'user:email' ] }))


router.get('/github/callback', function(req, res, next){
	passport.authenticate('github', function(err, user, info){
		if(err){
			// res.redirect('/')
			throw err;
		}
		if(!user){
			res.redirect('/login');
		}else{
			setSession(req, res, user)
			res.redirect('/profile');
		}
	})(req, res, next);
})

router.post('/local/signup', function(req, res, next){

	passport.authenticate('local-signup', function(err, user, info){
		if(err){
			res.writeHead(401, {"Content-Type": "application/json"})
			res.end(JSON.stringify({message: "Error Occurred"}))
			throw err;
		}
		if(!user){
			res.writeHead(401, {"Content-Type": "application/json"})
			res.end(JSON.stringify({message: info.message}))
		}else{
			setSession(req, res, user)
			res.writeHead(200)
			res.end()
		}
	})(req, res, next);
})


router.post('/local/login', function(req, res, next){
	//console.log('req: ' + JSON.stringify(req));
	passport.authenticate('local-login', function(err, user, info){
		if(err){
			res.writeHead(401, {"Content-Type": "application/json"})
			res.end(JSON.stringify({message: "Error Occurred"}))
			throw err;
		}
		if(!user){
			res.writeHead(401, {"Content-Type": "application/json"})
			res.end(JSON.stringify({message: info.message}))
		}else{
			setSession(req, res, user)
			res.writeHead(200)
			res.end()
		}
	})(req, res, next);
})

router.get('/logout', function(req, res, next){
	unsetSession(req)
	res.writeHead(200)
	res.end()
})

router.get('/loggedInUser', function(req, res, next){
	if(req.session.user){
		res.writeHead(200, {"Content-Type": "application/json"})
		res.end(JSON.stringify({logged: true, user: req.session.user}))
	}else{
		res.writeHead(200, {"Content-Type": "application/json"})
		res.end(JSON.stringify({logged: false}))
	}
})

 /**
 * Given a user object:
 *
 *  - Store the user object as a req.user
 *  - Make the user object available to templates as #{user}
 *  - Set a session cookie with the user object
 *
 *  @param {Object} req - The http request object.
 *  @param {Object} res - The http response object.
 *  @param {Object} user - A user object.
 */
function setSession(req, res, user){
	// Set session, currently just a place holder!
	var cleanUser = {
    	_id: user._id,
    	email:  user.email,
    	username: user.username,
    	accounttype: user.accounttype //Exists to personalize user experience
  	};
  	req.session.user = cleanUser; //refresh the session value
  	req.user = cleanUser;
  	res.locals.user = cleanUser;
}

function unsetSession(req){
	// Again, just a place holder
	console.log("Logging out user")
	req.session.destroy();
	req.user = null
}

module.exports = router;
