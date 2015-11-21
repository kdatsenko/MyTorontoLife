var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/login', function(req, res, next){
	if(req.session.profile){
		res.render('login', {logged: true, username: req.session.profile.username})
	}else{
		res.render('login')
	}
})

module.exports = router;
