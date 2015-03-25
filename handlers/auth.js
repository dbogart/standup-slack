var request = require('request');
var pg = require('pg');

exports.get = function(req, res) {
  var code = req.query.code;
  var body = {
    "client_id": process.env.CLIENT_ID,
    "client_secret": process.env.CLIENT_SECRET,
    "code": code,
    "redirect_uri": "https://intense-gorge-7336.herokuapp.com/auth"
  };

  request.post('https://slack.com/api/oauth.access', {form: body}, function(err, r, body) {
    if (err) {
      console.log('code exchange failed', err);
      res.status(400);
    } else {
      var result = JSON.parse(body);
      var accessToken = result.access_token;

      if (result.ok) {
        request('https://slack.com/api/auth.test?token=' + accessToken, function(err, resp, body) {
          if (err) {
            console.log('failed to get auth info', err);
            res.status(500).end();
          } else {
            var userId = JSON.parse(body).user_id;

            pg.connect(process.env.DATABASE_URL, function(err, client, done) {
              if (err) {
                console.log('postgres connection error', err);
                res.status(500).send('There was an error with your request :(');
                client.end();
                done();
                return;
              }

              client.query("INSERT INTO users (id, token) VALUES ($1, $2)", [userId, accessToken], function(err, result) {
                done();
                client.end();

                if (err) {
                  console.error('error inserting data', err);
                  res.status('500').end();
                } else {
                  res.send('OK');
                }
              });
            });
          }
        });
      } else {
        res.status(401).send(result.error);
      }
    }
  });
};
