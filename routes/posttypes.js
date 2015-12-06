var express = require('express');
var router = express.Router();

var middleware = require('../middleware');
var checkAdmin = middleware.checkAdmin;


var models = {};
models.PostTypes = require('mongoose').model('PostTypes');


/* Get all Post Types */
router.get('/posttypes', function(req, res) {
  //Retrieve entire post types list from DB
    models.PostTypes.find({}, function(err, types) {
    if (err) {
      return res.send(err);
    }
    res.json(types);
    });
});

module.exports = router;
