/*
 * Standard standup formatter.
 *
 * Example output:
 * _*Standup*_
 * > *Yesterday*: Did some refactoring
 * > *Today*: Nothing
 */

exports.format = function(text) {
  var standupMessage = '_*Standup*_\n';
  var parsedText = JSON.parse(text);
  var keys = Object.keys(parsedText);
  keys.forEach(function (key, index) {
    standupMessage += '> *' + key + '*: ' + parsedText[key];
    if (index < keys.length-1) {
      standupMessage += '\n';
    }
  });
  return standupMessage;
};
