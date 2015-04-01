// App dependencies
var express = require('express');
var mainHandler = require('./handlers/main.js');
var authHandler = require('./handlers/auth.js');
var badjsonHandler = require('./handlers/badjson.js');

// Setup
var app = express();
app.set('port', (process.env.PORT || 5000));

app.post('/', mainHandler.post);
app.get('/badjson', badjsonHandler.get);
app.get('/auth', authHandler.get);

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'));
});
