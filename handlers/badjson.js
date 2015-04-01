var fs = require('fs');

exports.get = function(req, res) {
  var jsonFile = 'temp/' + req.query.json;
  fs.readFile(jsonFile, 'utf8', function(err, data) {
    if (err) {
      console.log('Error reading file ' + jsonFile, err);
      res.status(404).send("<center><img src='http://i.imgur.com/W7mqS78.gif'></center>");
    } else {
      fs.unlink(jsonFile, function(err) {
        if (err) {
          console.log('Unable to remove ' + jsonFile);
        }
      });
      res.type('json').send(data);
    }
  });
};
