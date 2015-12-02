var express = require('express');
var router = express.Router();

/* GET home page. */

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
