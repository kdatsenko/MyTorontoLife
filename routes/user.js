var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send("Logged-in User Profile"); // placeholder
});

/* get profile for user_id */
router.get('/:user_id', function(req, res, next) {
  res.send(req.params.user_id+" user Profile"); // placeholder
});

module.exports = router;
