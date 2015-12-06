var path = require('path');
//var Users = require('mongoose').model('Users');
var mongoose = require('mongoose');
var models = require('../models/dbschema');


module.exports = {}
/**
 * Ensure a user is logged in before allowing them to continue their request.
 *
 * If a user isn't logged in, they'll be redirected back to the login page.
 */
 module.exports.requireLogin = function requireLogin (req, res, next) {
   if(req.session.user){
     req.user = req.session.user;
   }

  if (!req.user) { //Checks if a user is logged in or not
    req.session.destroy();
    res.redirect('/');
  } else {
    next();
  }
};

/**
 * Check the user's session to confirm that they have Admin status.
 * Used for authentication for certain sensitive actions with the DB.
 * Pass admin_type as 0 or 1 for super or admin depending on action.
 */
 module.exports.checkAdmin =  function(request, response, admin_type) {
  if (request.session && request.session.user) {
    if (admin_type == request.session.user.accounttype){
      return true;
    } else {
      console.log('User is not an administrator. ' + admin_type + ' ' + request.session.user.accounttype);
      return false;
    }
  } else {
    console.log('User is not an administrator: Session DNE.');
    return false;
  }
 };

module.exports.installHelpers = function(request, response, next){
  response.json = function(data){
    console.log("Please use res.sendData instead of response.json");
    response.send(JSON.stringify(data, null, 2))
  }
  response.sendData = function(data){
    return response.format({
      json: function(){
        response.status(200).send(JSON.stringify({'success': 'true', 'data': data }, null, 2));
      },
      html: function(){
        response.sendFile(path.join('public', 'index.html'), {root: __dirname+"/.."});
      },
      'default': function() {
        response.status(406).send('Not Acceptable');
      }
    });
  }
  response.sendError = function(code, message){
    return response.status(code).format({
      text: function(){
        response.send('Error '+code+': '+message);
      },

      html: function(){
        response.sendFile(path.join('public', 'index.html'), {root: __dirname+"/.."});
      },

      json: function(){
        response.send(JSON.stringify({'success': 'false', 'message': message }, null, 2));
      },

      'default': function() {
        response.send('Error '+code+': '+message);
      }
    });
  }
  next();
}

/**
 *  Middleware for ensuring that a logged-in user with the right privilege exists
 *
 *  router.use('...', requireUser('regular'), ...) // For any logged-in user
 *  router.use('...', requireUser('Admin'), ...) // For any administrator
 *  router.use('...', requireUser('SuperAdmin'), ...) // For a superadmin
 */
module.exports.requireUser = function(userType){
  return function(request, response, next){
    if(request.session != undefined &&
       request.session.user != undefined &&
       request.session.user != null
    )
    {
      if(
        (
           userType.toLowerCase() == "superadmin" &&
           request.session.user.accounttype == 0
        )
        ||
        (
          userType.toLowerCase() == "admin" &&
          (
            request.session.user.accounttype == 1
            ||
            request.session.user.accounttype == 0
          )
        )
        ||
        (
               userType.toLowerCase().indexOf("admin") == -1
        )
      )
      {
         next();
      }
      else
      {
        if(userType.toLowerCase() == "superadmin")
        {
          response.sendError(403, "This action requires superadministrator privilege.");
        }
        else (userType.toLowerCase() == "admin")
        {
          response.sendError(403, "This action requires administrator privilege.");
        }
      }
    }
    else
    {
       response.status(403);
       if(request.accepts(['html', 'json']) != 'json'){
        return response.redirect('/login');
       }
       else{
         return response.send(JSON.stringify({'success': 'false', 'message': "This action requires you to log in." }, null, 2));
       }
    }
  }
}

module.exports.setupCORS = function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type, cookie');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
};

/**
 * A simple authentication middleware for Express.
 *
 * Global Middleware that checks for a session on every request
 * and sets req.user to user if the user is logged in.
 */
module.exports.verifyUser = function(req, res, next) {
	if (req.session && req.session.user) {
	  models.Users.findOne({ _id: req.session.user.id }, function(err, cleanUser) {
	    if (cleanUser) {
	      req.session.user = cleanUser; //refresh the session value
	    	req.user = cleanUser;
	    	res.locals.user = cleanUser;
	    }
	    // finishing processing the middleware and run the route
	    next();
	});
	} else {
	  next();
	}
}

module.exports.sendAngularHtml = function(filename, force){
  if(typeof filename == "boolean"){force = filename;}
  if(!filename || typeof filename == "boolean") {filename = 'index.html';}
  return function (request, response, next) {
    if(request.accepts(['html', 'json']) == 'html' || force){
       response.sendFile(path.join('public', filename), {root: __dirname+"/.."});
    }
    else{
      next();
    }
  }
}
