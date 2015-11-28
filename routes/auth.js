var express = require('express');
var router = express.Router();
var passport = require('passport')

/* /auth */
router.get('/github', passport.authenticate('github', { scope: [ 'user:email' ] }))


router.get('/github/callback', function(req, res, next){
	passport.authenticate('github', function(err, user, info){
		console.log(err, user, info)
		if(err){
			res.redirect('/')
			throw err;
		}
		if(!user){
			res.redirect('/')
		}else{
			setSession(req, user)
			res.redirect('/')
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
			setSession(req, user)
			res.writeHead(200)
			res.end()
		}
	})(req, res, next);
})


router.post('/local/login', function(req, res, next){
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
			setSession(req, user)
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

function setSession(req, user){
	// Set session, currently just a place holder!
	req.session.user = user
}

function unsetSession(req){
	// Again, just a place holder
	req.session.user = null
}

module.exports = router;
