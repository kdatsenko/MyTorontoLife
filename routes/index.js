var express = require('express');
var path = require('path');

var router = express.Router();
var admin = express.Router();
var login = express.Router();
var api = express.Router();

var middleware = require('../middleware');
var checkAdmin = middleware.checkAdmin;

/* GET home page. */


login.use('/auth', require('./auth'));
login.get('/login', middleware.sendAngularHtml(true));


admin.use(middleware.requireUser('Admin'));
admin.use(require('./admin'));
admin.use(middleware.sendAngularHtml('admin.html'))

api.use(middleware.requireUser('any'));
api.use('/interests', require('./interests'));
api.use('/dashboard', require('./dashboard'));
api.use('/groups', require('./groups'));
api.use('/posts',  require('./posts'));
api.use('/posttypes',  require('./posttypes'));
api.use('/tags', require('./tags'));
api.use('/users', require('./users'));

router.use('/admin', [middleware.installHelpers,middleware.sendAngularHtml(),admin]);
router.use([middleware.installHelpers,
            login,
            middleware.setupCORS,
            middleware.verifyUser,
            middleware.sendAngularHtml(),
            api,
            middleware.sendAngularHtml()]);


module.exports = router;
