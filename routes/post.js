var express = require('express');
var router = express.Router();

/* The posts page shows a single post. */
router.get('/:post_id', function(req, res, next) {
  res.send("Post"); // placeholder
});

module.exports = router;
