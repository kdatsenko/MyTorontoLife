var express = require('express');
var path = require('path');

var router = express.Router();
var admin = express.Router();
var login = express.Router();
var api = express.Router();

var middleware = require('../middleware');


/* GET home page. */


login.use('/auth', require('./auth'));

login.get('/login', middleware.sendAngularHtml);



admin.use(middleware.requireUser('Admin'));
admin.use(require('./admin'));

api.use(middleware.requireUser('any'));
api.use('/interests', require('./interests'));
api.use('/dashboard', require('./dashboard'));
api.use('/groups', require('./groups'));
api.use('/posts',  require('./posts'));
api.use('/posttypes',  require('./posttypes'));
api.use('/tags', require('./tags'));
api.use('/users', require('./users'));

router.use('/admin', admin);
router.use([login,
            middleware.verifyUser,
            middleware.sendAngularHtml,
            middleware.installHelpers,
            middleware.setupCORS,
            api,
            middleware.sendAngularHtml]);


module.exports = router;
