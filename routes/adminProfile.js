var express = require('express');
var router = express.Router();
var schema = require('../models/dbschema');
var mongoose = require('mongoose');

var Users = schema.Users;

/* GET admin page. */
router.get('/', function(req, res) {
    res.render('adminProfile');
});

router.post('/:email', function(req, res) { //admin email
    var email = req.params.email;
    Users.update({'email': email}, function(error, users) {
      if (error) {
        res.send(error: 'Fail to change password', status: 'fail');
      } else {
        res.send(success: 'Successfully changed password:', status: 'success');
      }
    })
});


module.exports = router;
