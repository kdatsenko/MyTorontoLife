var express = require('express');
var router = express.Router();

/* GET home page. */

router.use('/post', require('./post'));
router.use('/user', require('./user'));
router.use('/tag', require('./tag'));
router.use('/group', require('./group'));
router.use('/', require('./feed'));

module.exports = router;
