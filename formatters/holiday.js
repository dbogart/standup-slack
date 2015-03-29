/*
 * Holiday themed standup formatter.
 * If the current date is a holiday, we should add some decorations.
 */

var S = require('string');
var holidays = {
  "12/25": ":christmas_tree:"
};

var getDecoration = function(date) {
  // Plus 1 to month since month starts at 0.
  var key = (date.getMonth() + 1) + '/' + date.getDate();
  return holidays[key];
};

var decorate = function(text) {
  var emoji = getDecoration(new Date());
  if (emoji) {
    return emoji + text + emoji;
  }

  return text;
};

var buildTemplate = function(json) {
  var template = decorate('_*Standup*_') + '\n';
  var keys = Object.keys(json);
  keys.forEach(function(key, index) {
    template += '> *' + key + '*: {{' + key + '}}';
    if (index < keys.length-1) {
      template += '\n';
    }
  });

  return template;
};

exports.format = function(text) {
  var parsedText = JSON.parse(text);
  var standupMessage = buildTemplate(parsedText);
  return S(standupMessage).template(parsedText).s;
};
