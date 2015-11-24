var express = require('express');
var router = express.Router();

/* GET list of tags */
router.get('/', function(req, res, next) {
  res.send("List of Tags"); // placeholder
});

/* GET feed about a certain tag */
router.get('/:tag', function(req, res, next) {
  res.render('feed');
});

module.exports = router;
