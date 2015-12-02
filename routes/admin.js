var express = require('express');
var router = express.Router();
var schema = require('../models/dbschema');
var mongoose = require('mongoose');

var Users = require('mongoose').model('Users');
var Interests = require('mongoose').model('Interests');
var Groups = require('mongoose').model('Groups');
var Posts = require('mongoose').model('Posts');


/* GET admin page. */
router.get('/', function(req, res) {

    Users.find(function(err_user, users) {
    	Interests.find(function(err_interest, interests) {
    		Groups.find(function(err_group, groups) {
    			Posts.find(function(err_post, posts) {
    				//res.writeHead(200, {'Content-Type': 'application/json'});
    				res.json({
    					'users': users,
    					'interests': interests,
    					'groups': groups,
    					'posts': posts
    				});
    			});
    		});
    	});
    });
});

/*router.post('/deleteInterest/:id', function(req, res) {
    var id = req.params.id; 
    Interests.remove({'_id': id}, function(error, interests) {
      if (error) {
        res.send(error: 'Fail to delete an interest:' + id, status: 'fail');
      } else {
        res.send(success: 'Successfully delete an interest:' + id, status: 'success');
      }
    });
});


router.post('/deleteGroup/:id', function(req, res) {
    var id = req.params.id; 
    Groups.remove({'_id': id}, function(error, interests) {
      if (error) {
        res.send(error: 'Fail to delete an group:' + id, status: 'fail');
      } else {
        res.send(success: 'Successfully delete an group:' + id, status: 'success');
      }
    })
});*/


module.exports = router;
