var formidable = require('formidable');
var request = require('request');
var pg = require('pg');
var formatter = require('./formatters/defaultFormatter');

var postMessageToSlack = function(token, channel, message, callback) {
  var body = {
    "token": token,
    "channel": channel,
    "text": message,
    "as_user": true
  };
  request.post({url: 'https://slack.com/api/chat.postMessage', form: body}, function(err, resp, body) {
    if (err) {
      callback(err, null);
    } else {
      var result = JSON.parse(body);
      if (result.ok) {
        callback(null, resp);
      } else {
        callback(result.error, null);
      }
    }
  });
};

var checkIfUserRegistered = function(userId, callback) {
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    if (err) {
      done();
      client.end();
      callback(err, null);
      return;
    }

    client.query("SELECT * FROM users WHERE id = $1", [userId], function(err, result) {
      done();
      client.end();

      if (err) {
        callback(err, null);
      } else {
        var userExists = result.rowCount > 0;
        if (userExists) {
          callback(null, result.rows[0]);
        } else {
          callback(null, null);
        }
      }
    });
  });
};

exports.post = function(req, res) {
  var form = new formidable.IncomingForm();
  form.parse(req, function(err, fields) {
    if (err) {
      console.log('failed to parse request');
      res.statu(400).send('What a bad request *tsk* *tsk*...');
      return;
    }

    console.log('parsed request', fields);

    // Check if user is already registered
    checkIfUserRegistered(fields.user_id, function(err, user) {
      if (err) {
        console.log('Error checking if user is registered', err);
        res.status(500).end();
        return;
      }

      if (user) {
        // User exists!
        var text = fields.text;
        var standupMessage = formatter.format(text);
        console.log('Formatted standup message: ', standupMessage);
        if (standupMessage) {
          console.log('Posting standup message to Slack...');
          postMessageToSlack(user.token, fields.channel_id, standupMessage, function(err, resp) {
            if (err) {
              res.send('Could not post message because of ' + err);
            } else {
              res.end();
            }
          });
        } else {
          res.end();
        }
      } else {
        // User does not exist
        var url = 'https://slack.com/oauth/authorize?scope=read,post,client&client_id=' + process.env.CLIENT_ID;
        res.send('Authorize this app by visiting: ' + url);
      }
    });
  });
};
