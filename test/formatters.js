var chai = require('chai');
var expect = chai.expect;

describe('Formatter', function() {
  describe('default formatter', function() {

    var defaultFormatter = require('../formatters/defaultFormatter.js');
    it('should format valid standup messages', function() {
      var input = '{"Yesterday": "N/A", "Today": "N/A"}';
      var expected = '_*Standup*_\n> *Yesterday*: N/A\n> *Today*: N/A';
      expect(defaultFormatter.format(input)).to.equal(expected);
    });

  });
});
