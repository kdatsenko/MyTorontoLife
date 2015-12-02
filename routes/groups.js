var express = require('express');
var router = express.Router();

models = {};
models.Groups = require('mongoose').model('Groups');
models.GroupMembers = require('mongoose').model('GroupMembers');

var middleware = require("../middleware");
var requireLogin = middleware.requireLogin;
var checkAdmin = middleware.checkAdmin;
/* GET group home page. */
/*router.get('/', function(req, res, next) {
	console.log("efejfeklfj");
  res.render('hello.html');
});*/



/* getGroupByID */
router.get('/group', requireLogin, function(req, res) {
  //if admin, go ahead
  //Check group privacy, and members of the group => if user included, display
  models.Groups.findOne({ _id: req.query._id }, function(err, found_group) {
    if (err) {
      return res.send(err);
    } else if (!found_group){
      return res.status(404).send({error: 'The group with id ' + req.query._id + ' does not exist'});
    }
    if (!checkAdmin(req, res, 1) & !checkAdmin(req, res, 0) & (found_group.private_type == true)){
      models.GroupMembers.findOne({user: req.session.user.id, group: req.query._id}, function(err, usergroup) {
        if (err) {
          return res.send(err);
        }
        if (!usergroup){
          return res.status(403).send({error: 'Group access for this user is unauthorized'});
        } else {
          res.json(found_group);
        }
      });

    } else {
      res.json(found_group);
    }

  });
});


/* getAllGroups */
 router.get('/', requireLogin, function(req, res) {
/*
1. If user is admin, get all
2. If user is not admin, get only public & those they signed up for (private - todo)
*/
  //Retrieve entire list from DB
  //Authenticate the current user for Admin Status
  if (!checkAdmin(req, res, 1) & !checkAdmin(req, res, 0)){
      models.Groups.aggregate(
      {$project: {name: 1, short_description: {$substr : ["$description", 0, 100]}}},
      {$match: {private_type: false}},
      function(err, groups) {
        if (err) { return res.send(err); }
        res.json(groups);
      });
  } else { //Get only those that are non-private
      models.Groups.aggregate(
      {$project: {name: 1, short_description: {$substr : ["$description", 0, 100]}}},
      function(err, groups) {
        if (err) { return res.send(err); }
        res.json(groups);
      });
  }
});


/* Create a new group */
router.post('/groups/addnew', requireLogin, function(req, res) {
  var group = new models.Group(req.body.group); //create new
  models.Groups.findOne({name: group.name}, function(err, found_group) { //name should be unique
          if (!found_group) { //There couldn't be found an Existing Group with this name
              group.group_creator = req.session.user.id; //this user
              group.save(function(err) {
                  if (err) {
                      res.send(err); //ERROR
                  }
                  res.status(200).send({message: 'Created group successfully'});

              });
          } else {
            return res.status(401).send({error: "That group name is already taken."});
          }
      }); //FINDONE
});

/* Update group - only group creator can do this. */
router.put('/groups/group', requireLogin, function(req, res){
  models.Groups.findOne({ _id: req.body._id }, function(err, group) {
    if (err) {
      return res.send(err);
    }
    if (!checkAdmin(req, res, 1) & !checkAdmin(req, res, 0) & !(req.session.user.id == group.group_creator)){
      return res.status(403).send({error: 'Unauthorized account type'});
    }

    for (property in req.body) {
      group[property] = req.body[property];
    }

    //check if a group with this name already exists (cannot repeat names!)
    models.Groups.findOne({ _id: {$ne: req.body._id}, name: group.name} , function(err, group) {
        if (err) {res.send(err); }
        if (!group){ //group with new does not already exist
            // save the group details
            group.save(function(err) {
              if (err) {
                return res.send(err);
              }
              res.json({ message: 'Group updated!' });
            });
        } else {
          return res.status(401).send({error: "That Group name is already taken, please try another."});
        }

    });

  });

});


//add Join Group ---- need
//if group creator is not the req.id, then we know what type of request it is


router.post('/groups/group/addmember', requireLogin, function(req, res){
    models.Groups.findOne({ _id: req.body.group._id }, function(err, group) {
      if (err){
        return res.send(err);
      } else if (!group){
        return res.status(404).send({error: 'The group with id ' + req.body.group._id + ' does not exist'});
      }
      if (group.private_type == true & group.group_creator == req.session.user.id){
        addGroupMember(req, res, group);
      } else if (group.private_type == false){
        joinGroup(req, res, group);
      } else {
        return res.status(403).send({error: 'Private group: Unauthorized account type'});
      }
    });

});

var joinGroup = function (req, res, group){ //requireLogin
    models.GroupMembers.findOneAndUpdate({user: req.session.user.id, group: group._id},
        {user: req.session.user.id, group: group._id}, { upsert: true }, function(err, membership){
      res.json({ message: 'Joined group!', result: membership});
    });
};

//group creator add member
var addGroupMember = function (req, res, group){
    //req.body.user._id = id of user to add in req JSON body
    models.GroupMembers.findOneAndUpdate({user: req.body.user._id, group: group._id},
      {user: req.body.user._id, group: group._id}, { upsert: true }, function(err, membership){
      res.json({ message: 'Joined group!', result: membership});
    });
};

/**
 * Delete this group from the DB system.
 */
router.delete('/groups/group/:id', requireLogin, function(req, res) {
  if (!checkAdmin(req, res, 1) & !checkAdmin(req, res, 0)){ //Action only allowed for Admins.
    return res.status(403).send({error: 'Unauthorized account type'});
  }
  models.Groups.findById(req.params.id, function(err, group){
      if (!checkAdmin(req, res, 1) & !checkAdmin(req, res, 0) & group.group_creator != req.session.user.id){ //Action only allowed for Admins.
        return res.status(403).send({error: 'Unauthorized account type'});
      }
      group.remove(function(err, group) {
      if (err) {
        return res.send(err);
      } else if (group && group.result.n > 0){
        res.json({ message: 'Group ' + req.params.id + ' deleted!' });
      } else {
        res.json({ message: 'Unable to delete this group' });
      }
    });

  });

});

/* Get Group Posts */
router.get('/group/posts', requireLogin, function(req, res) {
//auth: only groups where the user is a member, or public
 models.Group.findById(req.query.groupid, function(err, group){
    if (!checkAdmin(req, res, 1) & !checkAdmin(req, res, 0)){
      if (err){
        return res.send(err);
      } else if (group.private_type){
        models.GroupMembers.findOne({user: req.session.user.id, group: req.query.groupid}, function(err, usergroup) {
          if (err){
            return res.send(err);
          } else if (!usergroup){
            return res.status(403).send({error: 'Unauthorized account type'});
          }
          getGroupPosts(req, res, group);
        });
      } //else PUBLIC group, goes to bottom function
    }
    getGroupPosts(req, res, group);
  });

});

/* Get 100 most recent posts for this group. Authen. is done in wrapper rest api method. */
var getGroupPosts = function (req, res, group){
    models.Posts.
    find({group:  group._id}).
    limit(100).
    sort({ date_posted: -1 }).
    select('post_type group short_text username userid date_posted averagerating numberofratings').
    exec(function(err, posts){
      if (err){
        return res.send(err);
      }
      return res.json(posts);
    });
};

module.exports = router;
