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
 module.exports.checkAdmin =  function checkAdmin(request, response, admin_type) {
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
