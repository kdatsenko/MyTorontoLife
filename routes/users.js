var express = require('express');
var router = express.Router();


models = {};
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
  if (!checkAdmin(req, res, 1) & !checkAdmin(req, res, 0) & !(req.session.user._id == req.body._id)){
    return res.status(403).send({error: 'Unauthorized account type'});
  }
  models.Users.findOne({ _id: req.body._id }, function(err, user) {
    if (err) {
      return res.send(err);
    }

    for (property in req.body) {
      user[property] = req.body[property];
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
  if (checkAdmin(req, res, 1) | checkAdmin(req, res, 0)){
    changePasswordRegular(req.body, res); //req, res
  } else if (req.session.user._id == req.body._id){
    changePasswordAdmin(req.body, res); //req, res
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
    update_user.password = user.new_password;
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
    if (update_user.password != user.old_password){
      return res.status(422).send({error: 'Incorrect password submission.'});
    }
    update_user.password = user.new_password;
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
/* router.post('/fileupload', multipartyMiddleware, function(req, res) {
  if (!checkAdmin(req, res, 1) & !checkAdmin(req, res, 0) & !(req.session.user.email == req.body.email)){
    return res.status(403).send({error: 'Unauthorized account type'});
  }
  var file = req.files.file;
  console.log(file.name);
  console.log(file.type);
  console.log(file.path);

    // get the temporary location of the file
    var tmp_path = file.path;
    // set where the file should actually exists - in this case it is in the "images" directory
    var target_path = './public/images/' + file.name;
    var relpath_html = '../images/' + file.name;

    // move the file from the temporary location to the intended location
    fs.rename(tmp_path, target_path, function(err) {
      if (err)
        return res.send(err);
        // delete the temporary file, so that the explicitly set temporary
        //upload dir does not get filled with unwanted files
        fs.unlink(tmp_path, function() {
          if (err) return res.send(err);
          res.send({relpath: relpath_html});
        });
        //Modify the DB to include the right link
        models.User.findOne({ email: req.body.email }, function(err, user) {
          if (err)
            return console.log(err);
        user.imageurl = relpath_html; //change image link
        // save the user
        user.save(function(err) {
          if (err) {
            return console.log(err);
          }
          console.log("User " + user.email + " image updated!");
        });
    });
    });

});*/

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
      models.GroupMembers.find({ user: req.session.user.id}, '-_id -user')
      .populate('group', 'name')
      .exec(function(err, groups) {
        if (err){
          return res.send(err);
        }
        res.json(groups);
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
