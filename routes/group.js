var express = require('express');
var router = express.Router();

/* GET group home page. */
router.get('/', function(req, res, next) {
  res.render('feed');
});

module.exports = router;
