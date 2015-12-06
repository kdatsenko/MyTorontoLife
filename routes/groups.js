var express = require('express');
var router = express.Router();
var middleware = require('../middleware');
var checkAdmin = middleware.checkAdmin;


var models = {};
models.Groups = require('mongoose').model('Groups');
models.GroupMembers = require('mongoose').model('GroupMembers');
models.Posts = require('mongoose').model('Posts');
models.Users = require('mongoose').model('Users');

//models.Interests = require('mongoose').model('Interests');
//var models = require('../models/dbschema');

var checkAdmin = require('../middleware').checkAdmin;


/* GET group home page. */
/*router.get('/', function(req, res, next) {
	console.log("efejfeklfj");
  res.render('hello.html');
});*/



/* getGroupByID */
router.get('/group', function(req, res) {
  //if admin, go ahead
  //Check group privacy, and members of the group => if user included, display
  models.Groups.findOne({ _id: req.query._id }, function(err, found_group) {
    if (err) {
      return res.send(err);
    } else if (!found_group){
      return res.status(404).send({error: 'The group with id ' + req.query._id + ' does not exist'});
    }
      models.GroupMembers.findOne({user: req.session.user._id, group: req.query._id}, function(err, usergroup) {
        if (err) {
          return res.send(err);
        }
        if (!usergroup && !checkAdmin(req, res, 1) && !checkAdmin(req, res, 0) && (found_group.private_type == true)){
          return res.status(403).send({error: 'Group access for this user is unauthorized'});
        } else if (!usergroup){
          res.json({is_member: false, group: found_group});
        } else {
          res.json({is_member: true, group: found_group});
        }
      });
  });
});


/* getAllGroups */
 router.get('/', function(req, res) {
/*
1. If user is admin, get all
2. If user is not admin, get only public & those they signed up for (private - todo)
*/
  //Retrieve entire list from DB
  //Authenticate the current user for Admin Status
  if (!middleware.checkAdmin(req, res, 1) & !middleware.checkAdmin(req, res, 0)){
      /*models.Groups.aggregate(
      [{$project: {name: 1, short_description: {$substr : ["$description", 0, 100]}}},
      {$match: {private_type: false}}],
      function(err, groups) {
          console.log("GROUPS")
          console.log(groups)
        if (err) {
            throw err
            return res.send(err);
        }
        res.json(groups);
    });*/
    models.Groups.find({private_type: false}, function (err, groups) {
        if(err){
            throw err
        }

        res.json(groups)
    })
  } else { //Get only those that are non-private
      models.Groups.aggregate(
      {$project: {name: 1, short_description: {$substr : ["$description", 0, 100]}}},
      function(err, groups) {
        if (err) { return res.send(err); }
        res.json(groups);
        console.log(JSON.stringify(groups))
      });
  }
});


/* Create a new group */
router.post('/addnew', function(req, res) {
  // var group = new models.Groups({
  //     name: req.body.group,
  //     privateType: req.body.privateType,
  //     short_description: req.body.short_description
  //     }); //create new
  models.Groups.findOne({name: group.name}, function(err, found_group) { //name should be unique
          if (!found_group) { //There couldn't be found an Existing Group with this name
              group.group_creator = req.session.user._id; //this user
              group.save(function(err, group) {
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
router.put('/group', function(req, res){
  models.Groups.findOne({ _id: req.body._id }, function(err, group) {
    if (err) {
      return res.send(err);
    }
    if (!checkAdmin(req, res, 1) & !checkAdmin(req, res, 0) & !(req.session.user._id == group.group_creator)){
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


router.post('/group/addmember', function(req, res){
    models.Groups.findOne({ _id: req.body.group._id }, function(err, group) {
      if (err){
        return res.send(err);
      } else if (!group){
        return res.status(404).send({error: 'The group with id ' + req.body.group._id + ' does not exist'});
      }
      if (group.private_type == true & group.group_creator == req.session.user._id){
        addGroupMember(req, res, group);
      } else if (group.private_type == false){
        joinGroup(req, res, group);
      } else {
        return res.status(403).send({error: 'Private group: Unauthorized account type'});
      }
    });

});

var joinGroup = function (req, res, group){
    // Surely the below won't work if a user's not in this group?
    /*models.GroupMembers.findOneAndUpdate({user: req.session.user.id, group: group._id},
        {user: req.session.user.id, group: group._id}, { upsert: true }, function(err, membership)
      res.json({ message: 'Joined group!', result: membership});
    });*/
    var membership = new models.GroupMembers()
    membership.user = req.session.user._id
    membership.group = group._id
    console.log(membership.user)
    console.log(membership.group)

    membership.save(function (err) {
        if(err){
            throw err
        }

        res.json({ message: 'Joined group!', result: membership})
    })
};

//group creator add member
var addGroupMember = function (req, res, group){
    //req.body.user._id = id of user to add in req JSON body
    models.GroupMembers.findOneAndUpdate({user: req.body.user._id, group: group._id},
      {user: req.body.user._id, group: group._id}, { upsert: true }, function(err, membership){
      if (err){ return res.send(err); }
      res.json({ message: 'Joined group!'});
    });
};


router.put('/group/removemember', function(req, res){
    models.Groups.findOne({ _id: req.body.group._id }, function(err, group) {
      if (err){
        return res.send(err);
      } else if (!group){
        return res.status(404).send({error: 'The group with id ' + req.body.group._id + ' does not exist'});
      }
      if (group.private_type == true & (group.group_creator == req.session.user._id | checkAdmin(req, res, 0) | checkAdmin(req, res, 1))){
        removeGroupMember(req, res, group);
      } else if (group.private_type == false){
        leaveGroup(req, res, group);
      } else {
        return res.status(403).send({error: 'Private group: Unauthorized account type'});
      }
    });

});

var leaveGroup = function (req, res, group){
    models.GroupMembers.findOneAndRemove({user: req.session.user._id, group: group._id}, function(err, membership){
      if (err){ return res.send(err); }
      res.json({ message: 'Member left the group!' });
    });
};

//group creator add member
var removeGroupMember = function (req, res, group){
    /* Unimplemented */
};



/**
 * Delete this group from the DB system.
 */
router.delete('/group/:id', function(req, res) {
  if (!checkAdmin(req, res, 1) & !checkAdmin(req, res, 0)){ //Action only allowed for Admins.
    return res.status(403).send({error: 'Unauthorized account type'});
  }
  models.Groups.findById(req.params.id, function(err, group){
      if (err) {return res.send(err);}
      console.log(JSON.stringify(group));
      if (!group) {
        return res.json({message: 'Group not found'});
      }
      if (!checkAdmin(req, res, 1) & !checkAdmin(req, res, 0) & group.group_creator != req.session.user._id){ //Action only allowed for Admins.
        return res.status(403).send({error: 'Unauthorized account type'});
        
      }
      group.remove(function(err, group) {
      if (err) {
        return res.send(err);
      } else if (group){
        res.json({ message: 'Group ' + group.name + ' deleted!' });
      } else {
        res.json({ message: 'Unable to delete this group' });
      }
    });

  });

});



/* Get Group Posts */
router.get('/group/posts', function(req, res) {
//auth: only groups where the user is a member, or public
  //console.log();
  console.log('req.query.groupid: ' + req.query.groupid);
 models.Groups.findById(req.query.groupid, function(err, group){
    console.log('group: ' + JSON.stringify(group));
    if (!checkAdmin(req, res, 1) & !checkAdmin(req, res, 0)){
      if (err){
        return res.send(err);
      } else if (group.private_type){
        models.GroupMembers.findOne({user: req.session.user._id, group: req.query.groupid}, function(err, usergroup) {
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
    populate({
      path: 'userid',
      select: 'imageurl'
    }).
    populate({
      path: 'interest',
      select: 'name'
    }).
    limit(100).
    sort({ date_posted: -1 }).
    select('post_type group short_text username userid date_posted averagerating interest numberofratings hashtags').
    exec(function(err, posts){
      if (err){
        return res.send(err);
      }
      return res.json({groupname: group.name, posts: posts});
    });
};

module.exports = router;
