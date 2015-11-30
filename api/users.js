var express = require('express');
var router = express.Router();

router.get('/:user_id', function(req, res, next) {
  res.json({});
});

module.exports = router;
