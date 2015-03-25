var formidable = require('formidable');
var pg = require('pg');

exports.post = function(req, res) {
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
        done();
        client.end();
        return;
      }

      client.query("SELECT * FROM users WHERE id = '" + userId + "'", function(err, result) {
        done();
        client.end();

        if (err) {
          console.log('query error', err);
          res.send('There was an error with your request :(');
        } else {
          if (result.rowCount > 0) {
            // TODO: Format message and send to Slack
            console.log(result.rows[0].token);
            res.end();
          } else {
            var url = 'https://slack.com/oauth/authorize?client_id=' + process.env.CLIENT_ID;
            res.send('Authorize this app by visiting: ' + url);
          }
        }
      });
    });
  });
};
