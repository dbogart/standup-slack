// App dependencies
var express = require('express');
var formidable = require('formidable');
var request = require('request');

var app = express();

app.post('/', function(req, res) {
  var form = new formidable.IncomingForm();
  form.parse(req, function(err, fields) {
    if (err) {
      console.log('failed to parse request');
      res.send('There was an error with your request :(');
    } else {
      console.log('parsed request', fields);
    }

    console.log(fields.user_id);
  });
});

app.listen(5000);
