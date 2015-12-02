var express = require('express');
var router = express.Router();

/* GET home page. */

/**
 * A simple authentication middleware for Express.
 *
 * Global Middleware that checks for a session on every request
 * and sets req.user to user if the user is logged in.
 */
router.use(function(req, res, next) {
	if (req.session && req.session.user) {
	  models.Users.findOne({ _id: req.session.user.id }, function(err, cleanUser) {
	    if (cleanUser) {
	      req.session.user = cleanUser; //refresh the session value
	    	req.user = cleanUser;
	    	res.locals.user = cleanUser;
	    }
	    // finishing processing the middleware and run the route
	    next();
	});
	} else {
	  next();
	}
});



router.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

router.use('/auth', require('./auth'));
router.use('/post', require('./post'));
router.use('/users', require('./users'));
router.use('/tag', require('./tag'));
router.use('/groups', require('./groups'));
router.use('/', require('./feed'));

router.get('/login', function(req, res, next){
	if(req.session && req.session.user){
		res.render('login', {logged: true, username: req.session.user.username})
	}else{
		res.render('login')
	}
})

module.exports = router;
