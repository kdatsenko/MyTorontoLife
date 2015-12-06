var express = require('express');
var router = express.Router();
var middleware = require('../middleware');
var crypt = require('../config/bcrypt')
var fs = require('fs');
var path = require('path');

var checkAdmin = middleware.checkAdmin;
var models = {};
models.Users = require('mongoose').model('Users');
models.GroupMembers = require('mongoose').model('GroupMembers');
models.Posts = require('mongoose').model('Posts');


/* Get user profile */
router.get('/profile', function(req, res) {

      models.Users.findOne({ username: req.query.username }, '-password')
      .populate({
      path: 'interests',
      //populate: { path: 'interests' }
      })
      .exec(function(err, user) {
        if (err) {
          return res.send(err);
        }
        if (!user){
          return res.status(404).send({error: 'User not found'});
        }
        res.json(user);
      });
});

/* Get a few credential feilds for the user with the email stored in the session. */
router.get('/credentials', function(req, res){
  var sess = req.session.user;
  return res.json({_id: sess._id, username: sess.username, accounttype: sess.accounttype});

});


// create, update, changepassword, upload image


/* Edit the user's profile */
router.put('/profile', function(req, res){
  //Action allowed only for Admins, or the user's own profile (session check)
  if (!(middleware.checkAdmin(req, res, 1) || middleware.checkAdmin(req, res, 0) || (req.session.user._id == req.body.user._id))){
    return res.status(403).send({error: 'Unauthorized account type'});
  }
  models.Users.findOne({ _id: req.body.user._id }, function(err, user) {
    if (err) {
      return res.send(err);
    }

    for(property in req.body.user){
      user[property] = req.body.user[property]
    }

    // save the user profile details
    user.save(function(err) {
      if (err) {
        return res.send(err);
      }
      res.json({ message: 'User profile updated!' });
    });

  });
});



/* Update the user's password. */
router.put('/profile/passwordchange', function(req,res){
//var changePassword = function (user){ //Require login
  if (middleware.checkAdmin(req, res, 1) || middleware.checkAdmin(req, res, 0)){
    changePasswordAdmin(req.body, res); //req, res
  } else if (req.session.user._id == req.body._id){
    changePasswordRegular(req.body, res); //req, res
  } else {
    return res.status(403).send({error: 'Unauthorized account type'});
  }
});


//Can bypass old password confirmation and change password directly
var changePasswordAdmin = function (user, res){
  //Action allowed only the user's own profile (session check)
  models.Users.findOne({ _id: user._id }, function(err, update_user) {
    if (err) {
      return res.send(err);
    }
    update_user.password = crypt.generateHash(user.new_password);
    // save the user's new password to DB
    update_user.save(function(err) {
      if (err) {
        return res.send(err);
      }
      res.json({message: "Password successfully updated." });
    });
  });
};

/* Update this user's record to Admin status */
router.put('/user/assignadmin/:email', function(req, res){
  if (!checkAdmin(req, res, 0) & !checkAdmin(req, res, 1)){ //Action allowed only for Admins.
    return res.status(403).send({error: 'Unauthorized account type'});
  }  
  models.Users.findOne({ email: req.params.email }, function(err, user) {
      if (err){ return res.send(err); }
      if (!user){
        return res.status(404).send({error: "User not found"});
      }
      if (user.accounttype == 0 | user.accounttype == 1){
        return res.status(400).send({error: "Bad request"});
      }
      user.accounttype = 1; //Make user an Admin
      // save the user
      user.save(function(err) {
        if (err) {
          return res.send(err);
        }
        res.json({ message: "User " + user.username + " assigned to admin!" });
      });

  });

});

 /* Update this user's record to Regular Fries */
 router.put('/user/revokeadmin/:email', function(req, res){
  if (!checkAdmin(req, res, 0) & !checkAdmin(req, res, 1)){ //Action only allowed for Super Admins
    return res.status(403).send({error: 'Unauthorized account type'});
  }  
  models.Users.findOne({ email: req.params.email}, function(err, user) {
      if (err){ return res.send(err); }
      if (!user){
        return res.status(404).send({error: "User not found"});
      }
      if (user.accounttype == 0){
        return res.status(401).send({error: "Forbidden: deleting super admin"});
      }
      user.accounttype = 2; //Make user a simple user
      // save the user
      user.save(function(err) {
        if (err) {
          return res.send(err);
        }
        res.json({ message: "User " + user.username + " admin privilege revoked!" });
      });

  });
});

//Can expect a old password confirmation check
var changePasswordRegular = function (user, res){
  //Action allowed only for Admins
  models.Users.findOne({ _id: user._id }, function(err, update_user) {
    if (err) {
      return res.send(err);
    }

    if (crypt.validPassword(update_user.password, user.old_password)){
      return res.status(422).send({error: 'Incorrect password submission.'});
    }
    update_user.password = crypt.generateHash(user.new_password);
    // save the user's new password to DB
    update_user.save(function(err) {
      if (err) {
        return res.send(err);
      }
      res.json({message: "Password successfully updated." });
    });
  });
};



//upload image
/** Uploads an image file to the server, tranfers it to public/images folder,
 *  update the DB profile imageurl for this user.
 */
router.post('/fileupload', function(req, res) {
  if (!middleware.checkAdmin(req, res, 1) && !middleware.checkAdmin(req, res, 0) && !(req.session.user._id == req.body._id)){
    return res.status(403).send({error: 'Unauthorized account type'});
  }
  var file = req.body.file; // Data URL

  var regex = /^data:.+\/(.+);base64,(.*)$/; //Ext in first grpup, data in second

  var matches = file.match(regex);
  var ext = matches[1];
  var data = matches[2];

  if(!(/(gif|jpg|jpeg|tiff|png)$/i).test(ext)){
      return res.status(415).send({error: "Invalid file type"})
  }
  var buffer = new Buffer(data, 'base64');

  var filename = req.session.user._id + '.' + ext

  fs.writeFile(path.join(__dirname, "../public/images/" + filename), buffer, function (err) {
      if(err){
          throw err
      }

      models.Users.findOneAndUpdate({_id: req.body._id}, {imageurl: "/images/" + filename}, function (err, raw) {
          if(err){
              throw err
          }

          res.status(200).send({newURL: "/images/" + filename})
      })
  });

});

/* Get all a list of all users' email, username (for Admin) */
 router.get('/', function(req, res) {
  //Retrieve entire list from DB
  if (!checkAdmin(req, res, 1) & !checkAdmin(req, res, 0)){
    return res.status(403).send({error: 'Unauthorized account type'});
  }
  models.Users.find({}, '_id email username', function(err, users) {
    if (err) {
      return res.send(err);
    }
    console.log('GETTING USERS');
    console.log(users);
    res.json(users);
    });
});

 /* Get all this user's posts */
 router.get('/user/posts', function(req, res) {
  //Retrieve entire list from DB
  models.Posts.find({username: req.query.username})
  .populate({
    path: 'userid',
    select: 'imageurl'
  }).
  populate({
    path: 'interest',
    select: 'name'
  }).
  populate({
    path: 'group',
    select: 'name'
  }).
  select('post_type group short_text username userid date_posted averagerating interest numberofratings hashtags')
  .exec(function(err, posts){
    if (err){
      return res.send(err);
    }
    return res.json(posts);
  });
});

/* Get all this user's groups */
 router.get('/user/groups', function(req, res) {
  //get groups related to this user
  /*
1. Get all thi's user's group
UserGroups - for this userid, get all the groupids, populate with group name, and id
[ { group: { name: 'Toronto', _id: 5658ed81876352c41cb95891 } },
  { group: { name: 'Etobicoke', _id: 5658ed81876352c41cb95892 } },
  { group: { name: 'Little Italy', _id: 5658ed81876352c41cb95893 } } ]
  */
      var id;
      if(req.query.id){
          id = req.query.id;
      }else{
          id = req.session.user._id;
      }
      models.GroupMembers.find({ user: id}, '-_id -user')
      .populate({path: 'group', model: 'Groups', select:'_id name description'})
      .lean()
      .exec(function(err, groups) {
        if (err){
          return res.send(err);
        }
        var group_array = groups.map(function(group_beautified){
          return {_id: group_beautified.group._id,
               name: group_beautified.group.name,
               description: group_beautified.group.description};
        });
        res.json(group_array);
        //send as res
      });
});

/**
 * Delete the user's record from the DB system.
 */
router.delete('/profile/:id', function(req, res) {
  if (!checkAdmin(req, res, 1) & !checkAdmin(req, res, 0)){ //Action only allowed for Admins.
    return res.status(403).send({error: 'Unauthorized account type'});
  }
  models.Users.findById(req.params.id, function(err, user){
      if (err) {return res.send(err);}
      if (!user) {
        return res.json({message: 'User not found'});
      } else if (user.accounttype == 0) {
        return res.json({message: 'Deletion of Super Admin account not allowed.'});
      }
      user.remove(function(err, user_rem) {
      if (err) {
        return res.send(err);
      } else if (user_rem){
        res.json({ message: 'User ' + user_rem.username + ' deleted!' });
      } else {
        res.json({ message: 'Unable to delete this user' });
      }
    });
  });
});

router.get('/hasEditPermission', function(req, res, next){
  var username = req.query.username
  console.log(username)

  if(!req.session.user){
    res.status(401).send({error: "Not logged in"})
  }

  models.Users.findOne({username: username}, function(err, foundUser){
    if(err){
      throw err;
    }
    if(!foundUser){
      return res.status(404).send({error: "User not found"})
    }
    if(req.session.user.accountType > foundUser.accountType || req.session.user.username == foundUser.username){
      return res.status(200).send({hasEditPermission: true})
    }else{
      return res.status(200).send({hasEditPermission: false})
    }
  })
})


module.exports = router;
