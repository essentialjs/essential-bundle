var fs = require('fs'),
  path = require('path'),
  util = require('util');

var TMPL = fs.readFileSync(path.join(__dirname,'./template.tmpl'), 'utf-8'),
  SINGLE_MODULE_TMPL = fs.readFileSync(path.join(__dirname,'./singleModule.tmpl'),'utf-8');

function escapeContent(content) {
  return content.replace(/\\/g, '\\\\').replace(/'/g, '\\\'').replace(/\r?\n/g, '\\n\' +\n    \'');
}

module.exports = function(fileName, content, moduleName, moduleVar) {
  var escaped = escapeContent(content);

  var output = null;
  moduleVar = moduleVar || 'module';
  if (moduleVar) {
    output = util.format(SINGLE_MODULE_TMPL,
      moduleVar,
      moduleVar, moduleName,
      moduleVar, moduleName,
      moduleVar,
      fileName, escaped);
  } else {
    output = util.format(TMPL, moduleVar, fileName, moduleVar, fileName, escaped);
  }

  return output;
};
