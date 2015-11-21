var express = require('express');
var router = express.Router();
var passport = require('passport')

/* /auth */
router.get('/github', passport.authenticate('github', { scope: [ 'user:email' ] }))

router.get('/github/callback', passport.authenticate('github', {
		successRedirect: '/login',
		failureRedirect: '/login'}))

module.exports = router;
