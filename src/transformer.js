var xmldoc = require('xmldoc');

module.exports = function transformer(contents, matchPattern) {
  var xDoc, outputObj;

  xDoc = new xmldoc.XmlDocument(contents);
  outputObj = {};

  xDoc.eachChild(function (node) {
    var currentKey, currentValue;
    if (node.name === 'data') {
      currentKey = node.attr.name;

      if (matchPattern) {
        if (!matchPattern.test(currentKey)) {
          return;
        }
      }

      try {
        currentValue = node.children[0].val;
        outputObj[currentKey] = currentValue;
      } catch (err) {
        throw currentKey;
      }
    }
  });

  return outputObj;
}
