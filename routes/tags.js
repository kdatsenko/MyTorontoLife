var express = require('express');
var router = express.Router();

models = {};
models.HashTags = require('mongoose').model('HashTags');


/*
Get Hash Tags (Hash tag index)
There are two parameters, use_count, and date_last_used. Which takes precedent?
For now, I'll use date_last_used first, get tags used less than 100 days ago, order
by use_count descending, and extract the top 100 of the list.
*/
app.get('/', requireLogin, function(req, res) {
  var today = moment();
  var daysago = moment(today).subtract(100, 'days')
  models.HashTags.
  find({}).
  where('last_used').gt(daysago.toDate()).
  sort({ count: -1 }).
  limit(100).
  select('name').
  exec(function(err, tags){
    if (err) {
      return res.send(err);
    }
    return res.json(tags);
  });

});

module.exports = router;
