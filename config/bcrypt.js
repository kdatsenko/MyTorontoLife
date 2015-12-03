var bcrypt = require('bcrypt-nodejs')

module.exports.generateHash = function(password){
return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
}

module.exports.validPassword = function(password, user){
	try{
		return bcrypt.compareSync(password, user.password)
	}catch(err){
		// This usually only happens when there are non-hashed passwords
		// in the db
		console.log('Ummm...');
		console.error(err)
		return false
	}
}