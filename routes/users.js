var express = require('express');
var router = express.Router();
var middleware = require('../middleware');
var crypt = require('../config/bcrypt')
var fs = require('fs');
var path = require('path');


var models = {};
models.Users = require('mongoose').model('Users');
models.GroupMembers = require('mongoose').model('GroupMembers');

/* Get user profile */
router.get('/profile', function(req, res) {
      console.log("We're here req.session.user" + req.session.user + "");
      models.Users.findOne({ username: req.query.username }, '-password')
      .populate({
      path: 'interests',
      //populate: { path: 'interests' }
      })
      .exec(function(err, user) {
        console.log("were here "  + user + " " + err);
        if (err) {
          return res.send(err);
        }
        if (!user){
          return res.status(404).send({error: 'User not found'});
        }
        res.json(user);
      });
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

  var filename = req.session.user._id + Math.random().toString(36).slice(2, 34) + '.' + ext

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
    res.json(users);
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
      if(!req.query.id){
        return res.sendError(400, "No query defined")
      }
      models.GroupMembers.find({ user: req.query.id}, '-_id -user')
      .populate('group', '-group_creator -private_type')
      .exec(function(err, groups) {
        if (err){
          return res.send(err);
        }
        res.sendData(groups)
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
      user.remove(function(err, user) {
      if (err) {
        return res.send(err);
      } else if (user && user.result.n > 0){
        res.json({ message: 'User ' + req.params.id + ' deleted!' });
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
