var express = require('express');
var router = express.Router();

/* GET home page. */

router.use('/post', require('./post'));
router.use('/user', require('./user'));
router.use('/tag', require('./tag'));
router.use('/group', require('./group'));
router.use('/', require('./feed'));

router.get('/login', function(req, res, next){
	if(req.session.profile){
		res.render('login', {logged: true, username: req.session.profile.username})
	}else{
		res.render('login')
	}
})

module.exports = router;
