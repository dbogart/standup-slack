var formidable = require('formidable');

exports.get = function(req, res) {
  var form = new formidable.IncomingForm();
  form.parse(req, function(err, fields) {
    if (err) {
      console.log('failed to parse request');
      res.sendStatus(500);
    } else {
      console.log('parsed request', fields);
      res.end();
    }
  });
};
