/*
 * Standard standup formatter.
 *
 * Example output:
 * _*Standup*_
 * > *Yesterday*: Did some refactoring
 * > *Today*: Nothing
 */

var S = require('string');

var buildTemplate = function(json) {
  var template = '_*Standup*_\n';
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
