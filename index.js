// App dependencies
var express = require('express');
var formidable = require('formidable');
var request = require('request');
var pg = require('pg');

// Setup
var app = express();
app.set('port', (process.env.PORT || 5000));

app.post('/', function(req, res) {
  var form = new formidable.IncomingForm();
  form.parse(req, function(err, fields) {
    if (err) {
      console.log('failed to parse request');
      res.send('There was an error with your request :(');
    } else {
      console.log('parsed request', fields);
    }

    // Check if user is already registered
    var userId = fields.user_id;
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
      if (err) {
        console.log('postgres connection error', err);
        res.send('There was an error with your request :(');
      }

      client.query('SELECT * FROM users WHERE id = "' + userId + '"', function(err, result) {
        done();
        if (err) {
          console.log('query error', err);
          res.send('There was an error with your request :(');
        } else {
          console.log(result);
        }

        res.end();
      });
    });
  });
});

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'));
});
