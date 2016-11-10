var async = require('async');

exports.locale = function(req, res) {
  res.cookie('locale', req.params.locale);
  res.redirect('back');
}
