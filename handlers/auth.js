var request = require('request');

exports.get = function(req, res) {
  var code = req.query.code;
  var body = {
    "client_id": process.env.CLIENT_ID,
    "client_secret": process.env.CLIENT_SECRET,
    "code": code,
    "redirect_uri": "https://intense-gorge-7336.herokuapp.com/auth"
  };
  request.post('https://slack.com/api/oauth.access', {form: body}, function(err, r, body) {
    console.log(body);
    res.send('OK');
  });
};
